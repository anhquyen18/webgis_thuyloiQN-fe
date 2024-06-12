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
          :columns="columns"
          :data-source="dataSource"
          :loading="tableLoading"
          :bordered="false"
          :showSorterTooltip="false"
          :scroll="{ x: true }">
          <template #title>
            <a-row>
              <a-col flex="1 1 300px">
                <p class="fs-4 fw-bold">Hoạt động người dùng</p>
              </a-col>
              <a-col flex="">
                <a-flex gap="middle">
                  <a-button class="ps-3 pe-3 fw-bold" type="default" ghost @click="reloadTable">
                    <i class="fa-solid fa-rotate-right"></i>
                  </a-button>
                  <a-select
                    v-model:value="logType"
                    :options="logTypeOptions"
                    @change="logTypeChange"
                    style="width: 150px" />
                </a-flex>
              </a-col>
            </a-row>
            <a-row>
              <a-col class="mt-1" :xs="24">
                <p style="font-size: 0.8rem">Ghi lại các hoạt động của người dùng trên ứng dụng.</p>
              </a-col>
              <a-col :xs="24" :md="16">
                <a-input
                  v-model:value="logSearchValue"
                  class="mt-2"
                  placeholder="Tìm kiếm người dùng"
                  @change="logSearchChange">
                  <template #prefix>
                    <i class="fa-solid fa-magnifying-glass me-2"></i>
                  </template>
                </a-input>
              </a-col>
            </a-row>
          </template>

          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'name'">
              <u style="text-underline-offset: 3px">
                {{ record.name }}
              </u>
            </template>

            <template v-else-if="column.key === 'action'">
              <a-tag v-if="record.action == 'created'" color="#87d068"> {{ record.action }} </a-tag>
              <a-tag v-else-if="record.action == 'updated'" color="#108ee9"> {{ record.action }} </a-tag>
              <a-tag v-else-if="record.action == 'deleted'" color="#f50"> {{ record.action }} </a-tag>
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
import { defineComponent, inject, ref } from 'vue';
import thuyLoiApi from '@/js/axios/thuyLoiApi';
import { userState } from '@/stores/user-state';
import { logState } from '@/stores/log-state';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { getItem } from '@/js/utils/localStorage.js';
import { getLastTime, getVnTime, removeAccents } from '@/js/utils/utils.js';

import {} from '@ant-design/icons-vue';

export default defineComponent({
  components: {},

  setup() {
    const router = useRouter();
    const route = useRoute();
    const pageLoading = inject('pageLoading');
    const tableLoading = ref(true);
    const userProfile = inject('userProfile');
    const logStateStore = logState();

    // console.log(route.query.section);
    // console.log(logStateStore.getLogType);
    // if (!route.query.section && !logStateStore.getLogType) {
    //   logStateStore.setLogType('ReservoirSafety');
    //   router.push({ query: { section: 'ReservoirSafety' } });
    // } else {
    //   // if (logStateStore.getLogType)
    //   router.push({ query: { section: logStateStore.getLogType } });
    //   logStateStore.setLogType(route.query.section);
    // }
    if (route.query.section === undefined && logStateStore.getLogType) {
      router.push({ query: { section: logStateStore.getLogType } });
    } else if (route.query.section !== undefined && !logStateStore.getLogType) {
      logStateStore.setLogType(route.query.section);
    } else {
      logStateStore.setLogType('ReservoirSafety');
      router.push({ query: { section: 'ReservoirSafety' } });
    }
    const getMethod = () => 'get' + logStateStore.getLogType;
    const setMethod = () => 'set' + logStateStore.getLogType;

    const tableState = ref({
      selectedRowKeys: [],
      loading: false,
    });

    const onSelectChange = (selectedRowKeys) => {
      tableState.value.selectedRowKeys = selectedRowKeys;
    };

    const originDataSource = ref();
    const dataSource = ref();

    const getLogs = (type) => {
      tableLoading.value = true;
      thuyLoiApi
        .get(`/users/logs`, {
          headers: {
            Authorization: `Bearer ${getItem('accessToken')}`,
          },
          params: { type: type },
        })
        .then((response) => {
          //   console.log(response.data);
          const method = 'set' + type;
          logStateStore[method](response.data.logs);
          originDataSource.value = response.data.logs;
          dataSource.value = response.data.logs;
          tableLoading.value = false;
        })
        .catch((error) => {
          console.log(error);
          router.push({ name: 'account-manager-page' });
          logStateStore.setLogType(null);
          tableLoading.value = false;
        });
    };

    if (userState().getLogin && logStateStore[getMethod()]) {
      originDataSource.value = logStateStore[getMethod()];
      dataSource.value = logStateStore[getMethod()];
      tableLoading.value = false;
    } else {
      getLogs(logStateStore.getLogType);
    }

    const myGetLastTime = getVnTime;
    return {
      pageLoading,
      tableLoading,
      tableState,
      onSelectChange,
      userProfile,
      dataSource,
      originDataSource,
      myGetLastTime,
      ...storeToRefs(logStateStore),
      getMethod,
      setMethod,
      getLogs,
    };
  },

  data() {
    return {
      columns: [
        {
          title: 'Người dùng',
          dataIndex: 'user',
          key: 'user',
          sorter: (a, b) => a.user.username.length - b.user.username.length,
        },
        {
          title: 'Hành động',
          dataIndex: 'action',
          key: 'action',
          sorter: (a, b) => a.action - b.action,
        },
        {
          title: 'Đối tượng',
          dataIndex: 'log_id',
          key: 'log_id',
          sorter: (a, b) => a.log_id - b.log_id,
        },
        {
          title: 'Loại đối tượng',
          dataIndex: 'log_type',
          key: 'log_type',
          sorter: (a, b) => a.log_type - b.log_type,
        },
        {
          title: 'Thời gian',
          dataIndex: 'created_at',
          key: 'created_at',
          sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
        },
      ],
      logSearchValue: '',
      downloadLoading: false,
      logTypeOptions: [
        { value: 'ReservoirSafety', label: 'Báo cáo an toàn' },
        { value: 'ReservoirMaintainance', label: 'Báo cáo bảo dưỡng' },
        { value: 'ReservoirOperation', label: 'Báo cáo vận hành' },
        // { value: 'Reservoir', label: 'Công trình' },
      ],
    };
  },

  watch: {
    pageLoading: {
      handler() {
        if (!this.pageLoading) {
          //   this.getReports();
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
      this.getLogs(this.getLogType);
    },

    filterTable(text, dataSource) {
      return dataSource.filter(function (item) {
        return removeAccents(item.user.username.toLowerCase()).includes(removeAccents(text.toLowerCase()));
      });
    },

    logSearchChange() {
      this.dataSource = this.filterTable(this.logSearchValue, this.originDataSource);
    },

    logTypeChange() {
      this.$router.push({ query: { section: this.logType } });
      if (logState()[this.getMethod()]) {
        this.originDataSource = logState()[this.getMethod()];
        this.dataSource = logState()[this.getMethod()];
      } else {
        this.getLogs(this.getLogType);
      }
    },
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
