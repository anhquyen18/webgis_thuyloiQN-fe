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
          :row-selection="{ selectedRowKeys: tableState.selectedRowKeys, onChange: onSelectChange }"
          :columns="columns"
          :data-source="dataSource"
          :bordered="false"
          :showSorterTooltip="false">
          <template #title>
            <a-row>
              <a-col flex="1 1 300px">
                <p class="fs-4">Nhóm người dùng (2)</p>
              </a-col>
              <a-col flex="">
                <a-flex gap="middle">
                  <a-button class="ps-3 pe-3 fw-bold" type="default" ghost>
                    <i class="fa-solid fa-rotate-right"></i>
                  </a-button>
                  <a-button class="ps-3 pe-3 fw-bold" type="default">Xoá</a-button>
                  <a-button class="ps-3 pe-3 fw-bold" type="primary">Tạo nhóm</a-button>
                </a-flex>
              </a-col>
            </a-row>
            <a-row>
              <a-col class="mt-1" :xs="24">
                <p style="font-size: 0.8rem">
                  Một nhóm người dùng là một tập hợp người dùng được trao cho những quyền hạn nhất định.
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

          <template #headerCell="{ column }">
            <!-- <template v-if="column.key === 'name'">
              <span> Name </span>
            </template> -->
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <a-button class="no-border-ant-button" ghost>
                <u style="text-underline-offset: 3px">
                  {{ record.name }}
                </u>
              </a-button>
            </template>
            <template v-else-if="column.key === 'tags'">
              <span>
                <a-tag
                  v-for="tag in record.tags"
                  :key="tag"
                  :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'">
                  {{ tag.toUpperCase() }}
                </a-tag>
              </span>
            </template>
            <template v-else-if="column.key === 'action'">
              <span>
                <a>Invite 一 {{ record.name }}</a>
                <a-divider type="vertical" />
                <a>Delete</a>
                <a-divider type="vertical" />
                <a class="ant-dropdown-link"> More actions </a>
              </span>
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
import { getItem, setItem, removeItem } from '@/js/utils/localStorage.js';

export default defineComponent({
  setup() {
    const pageLoading = inject('pageLoading');
    const userProfile = inject('userProfile');

    const tableState = ref({
      selectedRowKeys: [],
      // Check here to configure the default column
      loading: false,
    });

    const onSelectChange = (selectedRowKeys) => {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      tableState.value.selectedRowKeys = selectedRowKeys;
    };

    return {
      pageLoading,
      tableState,
      onSelectChange,
      userProfile,
    };
  },

  data() {
    return {
      dataSource: [
        {
          key: '1',
          name: 'Bike',
          users: 33,
          permissions: 'yes',
          created: '2 tháng trước',
        },
        {
          key: '2',
          name: 'Mike',
          users: 11,
          permissions: 'yes',
          created: '2 tháng trước',
        },
        {
          key: '3',
          name: 'Hike',
          users: 55,
          permissions: 'yes',
          created: '2 tháng trước',
        },
        {
          key: '4',
          name: 'SMike',
          users: 66,
          permissions: 'yes',
          created: '2 tháng trước',
        },
        {
          key: '5',
          name: 'DMike',
          users: 122,
          permissions: 'yes',
          created: '2 tháng trước',
        },
        {
          key: '1',
          name: 'Bike',
          users: 33,
          permissions: 'yes',
          created: '2 tháng trước',
        },
        {
          key: '2',
          name: 'Mike',
          users: 11,
          permissions: 'yes',
          created: '2 tháng trước',
        },
        {
          key: '3',
          name: 'Hike',
          users: 55,
          permissions: 'yes',
          created: '2 tháng trước',
        },
        {
          key: '4',
          name: 'SMike',
          users: 66,
          permissions: 'yes',
          created: '2 tháng trước',
        },
        {
          key: '5',
          name: 'DMike',
          users: 122,
          permissions: 'yes',
          created: '2 tháng trước',
        },
        {
          key: '1',
          name: 'Bike',
          users: 33,
          permissions: 'yes',
          created: '2 tháng trước',
        },
        {
          key: '2',
          name: 'Mike',
          users: 11,
          permissions: 'yes',
          created: '2 tháng trước',
        },
        {
          key: '3',
          name: 'Hike',
          users: 55,
          permissions: 'yes',
          created: '2 tháng trước',
        },
        {
          key: '4',
          name: 'SMike',
          users: 66,
          permissions: 'yes',
          created: '2 tháng trước',
        },
        {
          key: '5',
          name: 'DMike',
          users: 122,
          permissions: 'yes',
          created: '2 tháng trước',
        },
      ],

      columns: [
        {
          title: 'Tên nhóm người dùng',
          dataIndex: 'name',
          key: 'name',
          sorter: (a, b) => a.name.length - b.name.length,
        },
        {
          title: 'Số lượng',
          dataIndex: 'users',
          key: 'users',
          sorter: (a, b) => a.age - b.age,
        },
        {
          title: 'Quyền hạn',
          dataIndex: 'permissions',
          key: 'permissions',
        },
        {
          title: 'Ngày được tạo',
          dataIndex: 'created',
          key: 'created',
          sorter: (a, b) => a.created.length - b.created.length,
        },
      ],
    };
  },

  computed: {},

  methods: {
    backward() {
      this.$router.push({ name: 'account-manager-page' });
    },
  },

  mounted() {
    thuyLoiApi
      .post(
        `/organization/user-organization-id/departments`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getItem('accessToken')}`,
          },
        },
      )
      .then((response) => {
        console.log(response);

        // this.$message.success(response.data.message, 3);
        // this.pageSpinning = false;
      })
      .catch((error) => {
        console.log(error);
        // if (error.code == 'ERR_CANCELED') {
        //   this.$message.error(error.message, 3);
        // } else {
        // this.$message.error(error.response.data.message, 3);
        // }
        // this.pageSpinning = false;
      });
  },
});
</script>

<style lang="scss"></style>
