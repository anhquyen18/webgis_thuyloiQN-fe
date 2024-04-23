<template>
  <a-flex vertical gap="20" align="center">
    <div class="account-manager-transparent-card">
      <a-button type="primary" shape="circle" size="large" style="height: 50px; width: 50px" @click="backward">
        <i class="fa-solid fa-chevron-left fs-5"></i>
      </a-button>
    </div>

    <!-- <div class="account-manager-transparent-card"> -->
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
          :expand-column-width="100"
          :scroll="{ x: true }">
          <template #title>
            <a-row>
              <a-col flex="1 1 300px">
                <p class="fs-4 fw-bold">Phòng ban ({{ this.dataSource.length }})</p>
              </a-col>
              <a-col flex="">
                <a-flex gap="middle">
                  <a-button class="ps-3 pe-3 fw-bold" type="default" ghost @click="reloadTable">
                    <i class="fa-solid fa-rotate-right"></i>
                  </a-button>
                  <a-button class="ps-3 pe-3 fw-bold" type="default">Xoá</a-button>

                  <router-link :to="{ name: 'account-manager-department-create' }">
                    <a-button class="ps-3 pe-3 fw-bold" type="primary">Tạo phòng ban</a-button>
                  </router-link>
                </a-flex>
              </a-col>
            </a-row>
            <a-row>
              <a-col class="mt-1" :xs="24">
                <p style="font-size: 0.8rem">
                  Một phòng ban là một tập hợp người dùng được trao cho những quyền hạn nhất định.
                </p>
              </a-col>
              <a-col :xs="24" :md="16">
                <a-input class="mt-2" placeholder="Tìm kiếm">
                  <template #prefix>
                    <i class="fa-solid fa-magnifying-glass me-2"></i>
                  </template>
                </a-input>
              </a-col>
            </a-row>
          </template>

          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'name'">
              <a-button class="no-border-ant-button" ghost>
                <u style="text-underline-offset: 3px">
                  {{ record.name }}
                </u>
              </a-button>
            </template>

            <template v-else-if="column.key === 'organization_name'">
              <span v-if="record.organization_name">{{ record.organization_name }}</span>
              <span v-else>
                <a-tag color="warning">
                  <template #icon>
                    <ExclamationCircleOutlined />
                  </template>
                  Chưa xác định
                </a-tag>
              </span>
            </template>

            <template v-else-if="column.key === 'users_count'">
              <span v-if="record.policies_count > 0">
                {{ record.users_count }}
              </span>

              <span class="text-warning" v-else>
                {{ record.users_count }}
                <ExclamationCircleOutlined />
              </span>
            </template>

            <template v-else-if="column.key === 'policies_count'">
              <a-tag v-if="record.policies_count > 0" color="success">
                <template #icon>
                  <CheckCircleOutlined />
                </template>
                Đã phân quyền
              </a-tag>

              <a-tag v-else color="warning">
                <template #icon>
                  <ExclamationCircleOutlined />
                </template>
                Chưa xác định
              </a-tag>
            </template>

            <template v-else-if="column.key === 'created'">
              <span>{{ myGetLastTime(record.created_at) }}</span>
            </template>
          </template>
        </a-table>
      </a-skeleton>
    </a-card>
    <!-- </div> -->
  </a-flex>
</template>

<script>
import { defineComponent, inject, ref } from 'vue';
import thuyLoiApi from '@/js/axios/thuyLoiApi';
import { userState } from '@/stores/user-state';
import { getItem, setItem, removeItem } from '@/js/utils/localStorage.js';
import { getLastTime } from '@/js/utils/utils.js';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
  },

  setup() {
    const pageLoading = inject('pageLoading');
    const userProfile = inject('userProfile');

    const tableState = ref({
      selectedRowKeys: [],
      // Check here to configure the default column
      loading: false,
    });

    const onSelectChange = (selectedRowKeys) => {
      // console.log('selectedRowKeys changed: ', selectedRowKeys);
      tableState.value.selectedRowKeys = selectedRowKeys;
    };

    const dataSource = ref();
    const allOrganizationAccess = ref();

    const getDepartments = (organizationId) => {
      pageLoading.value = true;
      thuyLoiApi
        .post(
          `/organization/${organizationId}/departments`,
          {},
          {
            headers: {
              Authorization: `Bearer ${getItem('accessToken')}`,
            },
          },
        )
        .then((response) => {
          // console.log(response);
          userState().setDepartments(response.data.departments);
          dataSource.value = userState().getDepartments;

          allOrganizationAccess.value = response.data.allAccess;
          pageLoading.value = false;
        })
        .catch((error) => {
          console.log(error);
          pageLoading.value = false;
        });
    };

    if (userState().getLogin) {
      if (!userState().getDepartments) {
        getDepartments(userProfile.value.organization_id);
      } else {
        dataSource.value = userState().getDepartments;
      }
    }

    const myGetLastTime = getLastTime;
    return {
      pageLoading,
      tableState,
      onSelectChange,
      userProfile,
      getDepartments,
      dataSource,
      allOrganizationAccess,
      myGetLastTime,
    };
  },

  data() {
    return {
      columns: [
        {
          title: 'Tên nhóm',
          dataIndex: 'name',
          key: 'name',
          sorter: (a, b) => a.name.length - b.name.length,
        },
        {
          title: 'Tổ chức',
          dataIndex: 'organization_name',
          key: 'organization_name',
          sorter: (a, b) => {
            const none = 'Chưa xác định';
            if (!a.organization_name) {
              return none.length - b.organization_name.length;
            } else if (!b.organization_name) {
              return a.organization_name - none.length;
            } else if (!a.organization_name && !b.organization_name) {
              return none.length - none.length;
            } else {
              return a.organization_name - b.organization_name;
            }
          },
        },
        {
          title: 'Số lượng',
          dataIndex: 'users_count',
          key: 'users_count',
          sorter: (a, b) => a.users_count - b.users_count,
          width: 100,
        },
        {
          title: 'Quyền hạn',
          dataIndex: 'policies_count',
          key: 'policies_count',
          sorter: (a, b) => a.policies_count - b.policies_count,
        },
        {
          title: 'Ngày được tạo',
          dataIndex: 'created',
          key: 'created',
          sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
          width: 150,
        },
      ],
      tableLoading: false,
    };
  },

  watch: {
    pageLoading: {
      handler() {
        if (!this.pageLoading && !userState().getDepartments) {
          this.getDepartments(this.userProfile.organization_id);
          // this.dataSource.users[0];
        } else {
          // this.dataSource = [];
        }
      },
      deep: false,
      once: true,
    },
  },

  computed: {},

  methods: {
    backward() {
      this.$router.push({ name: 'account-manager-page' });
    },

    reloadTable() {
      this.tableLoading = true;
      thuyLoiApi
        .post(
          `/organization/${this.userProfile.organization_id}/departments`,
          {},
          {
            headers: {
              Authorization: `Bearer ${getItem('accessToken')}`,
            },
          },
        )
        .then((response) => {
          // console.log(response);
          userState().setDepartments(response.data.departments);
          this.dataSource = userState().getDepartments;
          this.allOrganizationAccess = response.data.allAccess;
          this.tableLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.tableLoading = false;
        });
    },
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
