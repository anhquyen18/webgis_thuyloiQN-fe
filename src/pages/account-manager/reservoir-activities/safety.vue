<template>
  <a-flex vertical gap="20" align="center">
    <div class="account-manager-transparent-card">
      <a-button type="primary" shape="circle" size="large" style="height: 50px; width: 50px" @click="backward">
        <i class="fa-solid fa-chevron-left fs-5"></i>
      </a-button>
    </div>

    <a-card class="account-manager-card" :bordered="false">
      <a-skeleton :loading="pageLoading" active>
        <a-table
          class="account-manager-table"
          rowKey="id"
          :row-selection="{ selectedRowKeys: tableState.selectedRowKeys, onChange: onSelectChange }"
          :columns="columns"
          :data-source="dataSource"
          :loading="tableLoading"
          :bordered="false"
          :showSorterTooltip="false"
          :scroll="{ x: 1400 }">
          <template #title>
            <a-row>
              <a-col flex="1 1 300px">
                <p class="fs-4 fw-bold">
                  Báo cáo an toàn
                  <span class="fs-4 fw-bold" v-if="this.dataSource" style="color: lightgray">
                    ({{ this.dataSource.length }})
                  </span>
                </p>
              </a-col>
              <a-col flex="">
                <a-flex gap="middle">
                  <a-button class="ps-3 pe-3 fw-bold" type="default" ghost @click="reloadTable">
                    <i class="fa-solid fa-rotate-right"></i>
                  </a-button>

                  <ConfirmModal
                    v-if="hasPermissions([10])"
                    :buttonDisabled="this.tableState.selectedRowKeys.length < 1"
                    title="Bạn có chắc muốn xoá báo cáo?"
                    description="Dữ liệu được xoá sẽ không thể phục hồi."
                    :confirm="deleteReports">
                    <template #buttonContent>
                      <span>
                        <p class="me-2 ms-2 fw-bold">Xoá</p>
                      </span>
                    </template>
                  </ConfirmModal>

                  <CreateReservoirSafety v-if="hasPermissions([10])" buttonIcon="" buttonText="Tạo báo cáo" />
                </a-flex>

                <!-- <a-flex class="mt-2" gap="middle">
                  <a-button
                    class="ps-3 pe-3 fw-bold"
                    type="primary"
                    :disabled="this.tableState.selectedRowKeys.length !== 1">
                    Chỉnh sửa
                  </a-button>

                  <a-button
                    class="ps-3 pe-3 fw-bold"
                    type="primary"
                    :disabled="this.tableState.selectedRowKeys.length !== 1">
                    Tải xuống báo cáo
                  </a-button>
                </a-flex> -->
              </a-col>
            </a-row>
            <a-row>
              <a-col class="mt-1" :xs="24">
                <p style="font-size: 0.8rem">Mổ tả về báo cáo an toàn đập, nghị định....</p>
              </a-col>
              <a-col :xs="24" :md="16">
                <a-input
                  v-model:value="departmentSearchValue"
                  class="mt-2"
                  placeholder="Tìm kiếm phòng ban"
                  @change="departmentSearchChange">
                  <template #prefix>
                    <i class="fa-solid fa-magnifying-glass me-2"></i>
                  </template>
                </a-input>
              </a-col>
            </a-row>
          </template>

          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'name'">
              <a-row justify="space-between" align="middle">
                <UpdateReservoirSafety
                  v-if="hasPermissions([10])"
                  buttonClass="no-border-ant-button"
                  @completed="reloadTable"
                  :reportName="record.name"
                  :report="record"
                  :title="'Chỉnh sửa ' + record.name"
                  type="default"
                  :ghost="true">
                  <template #text>
                    <u style="text-underline-offset: 3px">
                      {{ record.name }}
                    </u>
                  </template>
                </UpdateReservoirSafety>

                <u v-else style="text-underline-offset: 3px">
                  {{ record.name }}
                </u>
                <a-button
                  v-if="record.finished_status"
                  type="primary"
                  size="small"
                  :loading="downloadLoading"
                  @click="downloadSafetyReport(record.id, record.name)">
                  <template #icon>
                    <DownloadOutlined />
                  </template>
                </a-button>
              </a-row>
            </template>

            <template v-else-if="column.key === 'finished_status'">
              <span v-if="record.finished_status">
                <a-tag color="success">
                  <template #icon>
                    <CheckCircleOutlined />
                  </template>
                  Đã hoàn thành
                </a-tag>
              </span>
              <span v-else>
                <a-tag color="warning">
                  <template #icon>
                    <FieldTimeOutlined />
                  </template>
                  Chưa hoàn thành
                </a-tag>
              </span>
            </template>

            <template v-else-if="column.key === 'organization_name'">
              <span v-if="record.user.organization">{{ record.user.organization.name }}</span>
              <span v-else>
                <a-tag color="warning">
                  <template #icon>
                    <ExclamationCircleOutlined />
                  </template>
                  Chưa xác định
                </a-tag>
              </span>
            </template>

            <template v-else-if="column.key === 'user'">
              <span>{{ record.user.username }}</span>
            </template>

            <template v-else-if="column.key === 'created_at'">
              <span>{{ myGetLastTime(record.created_at) }} </span> <br />
            </template>
          </template>
        </a-table>
      </a-skeleton>
    </a-card>
  </a-flex>
</template>

<script>
import { defineComponent, inject, ref, provide } from 'vue';
import thuyLoiApi from '@/js/axios/thuyLoiApi';
import { userState } from '@/stores/user-state';
import { useRouter } from 'vue-router';
import { irrigationState } from '@/stores/irrigation-state';
import { getItem } from '@/js/utils/localStorage.js';
import { getLastTime, removeAccents, downloadFile } from '@/js/utils/utils.js';
import ConfirmModal from '@/components/interface/confirm-modal.vue';
import CreateReservoirSafety from '@/components/irrigation-tools/create-reservoir-safety.vue';
import UpdateReservoirSafety from '@/components/irrigation-tools/update-reservoir-safety.vue';

import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  FieldTimeOutlined,
  DownloadOutlined,
} from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    CreateReservoirSafety,
    UpdateReservoirSafety,
    ConfirmModal,

    CheckCircleOutlined,
    ExclamationCircleOutlined,
    FieldTimeOutlined,
    DownloadOutlined,
  },

  setup() {
    const router = useRouter();
    const pageLoading = inject('pageLoading');
    const userProfile = inject('userProfile');
    const tableState = ref({
      selectedRowKeys: [],
      loading: false,
    });

    const onSelectChange = (selectedRowKeys) => {
      tableState.value.selectedRowKeys = selectedRowKeys;
    };

    const originDataSource = ref();
    const dataSource = ref();

    const getReports = () => {
      pageLoading.value = true;
      thuyLoiApi
        .get(`/reservoirs/safety-reports`, {
          headers: {
            Authorization: `Bearer ${getItem('accessToken')}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          irrigationState().setSafetyReports(response.data.reports);
          originDataSource.value = irrigationState().getSafetyReports;
          dataSource.value = irrigationState().getSafetyReports;

          pageLoading.value = false;
        })
        .catch((error) => {
          console.log(error);
          router.push({ name: 'account-manager-page' });
          pageLoading.value = false;
        });
    };

    if (userState().getLogin) {
      if (!irrigationState().getSafetyReports) {
        getReports();
      } else {
        originDataSource.value = irrigationState().getSafetyReports;
        dataSource.value = irrigationState().getSafetyReports;
      }
    }

    const myGetLastTime = getLastTime;
    return {
      pageLoading,
      tableState,
      onSelectChange,
      userProfile,
      getReports,
      dataSource,
      originDataSource,
      myGetLastTime,
    };
  },

  data() {
    return {
      columns: [
        {
          title: 'Tên',
          dataIndex: 'name',
          key: 'name',
          sorter: (a, b) => a.name.length - b.name.length,
        },
        {
          title: 'Trạng thái',
          dataIndex: 'finished_status',
          key: 'finished_status',
          sorter: (a, b) => a.finished_status - b.finished_status,
        },
        {
          title: 'Hồ chứa',
          dataIndex: 'reservoir_id',
          key: 'reservoir_id',
          sorter: (a, b) => a.reservoir_id - b.reservoir_id,
          width: 150,
        },
        {
          title: 'Ngày được tạo',
          dataIndex: 'created_at',
          key: 'created_at',
          sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
          width: 150,
        },
        {
          title: 'Ngày hoàn thành',
          dataIndex: 'date_finished',
          key: 'date_finished',
          sorter: (a, b) => new Date(a.date_finished) - new Date(b.date_finished),
        },
        {
          title: 'Người tạo',
          dataIndex: 'user',
          key: 'user',
          sorter: (a, b) => a.user.username.length - b.user.username.length,
        },
        {
          title: 'Tổ chức',
          dataIndex: 'organization_name',
          key: 'organization_name',
          sorter: (a, b) => {
            // console.log(a.organization_name, b.organization_name);
            const none = 'Chưa xác định';
            if (!a.organization_name && b.organization_name) {
              return none.length - b.organization_name.length;
            } else if (!b.organization_name && a.organization_name) {
              return a.organization_name - none.length;
            } else if (!a.organization_name && !b.organization_name) {
              return none.length - none.length;
            } else {
              return a.organization_name - b.organization_name;
            }
          },
          width: 200,
        },
        {
          title: 'Id',
          dataIndex: 'id',
          key: 'id',
          sorter: (a, b) => a.id.length - b.id.length,
        },
      ],
      tableLoading: false,
      departmentSearchValue: '',
      downloadLoading: false,
    };
  },

  watch: {
    pageLoading: {
      handler() {
        if (!this.pageLoading && !irrigationState().getSafetyReports) {
          this.getReports();
          // this.dataSource.users[0];
        } else {
          // this.dataSource = [];
        }
      },
      deep: false,
      once: true,
    },
  },

  computed: {
    loginState() {
      return userState().getLogin;
    },
  },

  methods: {
    backward() {
      this.$router.push({ name: 'account-manager-page' });
    },

    reloadTable() {
      this.tableLoading = true;
      thuyLoiApi
        .get(`/reservoirs/safety-reports`, {
          headers: {
            Authorization: `Bearer ${getItem('accessToken')}`,
          },
        })
        .then((response) => {
          // console.log(response.data);
          irrigationState().setSafetyReports(response.data.reports);
          this.originDataSource = irrigationState().getSafetyReports;
          this.dataSource = irrigationState().getSafetyReports;

          this.tableLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.tableLoading = false;
        });
    },

    deleteReports() {
      this.tableLoading = true;
      thuyLoiApi
        .delete(`/reservoirs/safety-reports/delete`, {
          headers: {
            Authorization: `Bearer ${getItem('accessToken')}`,
          },
          data: this.tableState.selectedRowKeys,
        })
        .then((response) => {
          console.log(response.data);
          this.reloadTable();
          this.$message.success('Xoá báo cáo thành công.');
          // this.tableLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.tableLoading = false;
          this.$message.error('Xoá báo cáo thất bại.');
        });
    },

    filterTable(text, dataSource) {
      return dataSource.filter(function (item) {
        return removeAccents(item.name.toLowerCase()).includes(removeAccents(text.toLowerCase()));
      });
    },

    departmentSearchChange() {
      this.dataSource = this.filterTable(this.departmentSearchValue, this.originDataSource);
    },

    hasPermissions(policies) {
      if (this.loginState) {
        return policies.some((policy) => {
          return userState().getUserProfile.allPolicies.some((userPolicy) => userPolicy.id == policy);
        });
      } else {
        return false;
      }
    },

    downloadSafetyReport(id, name) {
      this.downloadLoading = true;
      thuyLoiApi
        .get(`/reservoirs/safety-reports/${id}/download`, {
          headers: {
            Authorization: `Bearer ${getItem('accessToken')}`,
          },
          responseType: 'arraybuffer',
        })
        .then((response) => {
          console.log(response);
          downloadFile(response, name);
          this.downloadLoading = false;
        })
        .catch((error) => {
          this.downloadLoading = false;
          console.log(error);
        });
    },
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
