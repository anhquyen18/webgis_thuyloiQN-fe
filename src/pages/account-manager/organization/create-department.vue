<template>
  <a-flex vertical gap="20" align="center">
    <div class="account-manager-transparent-card">
      <a-button type="primary" shape="circle" size="large" style="height: 50px; width: 50px" @click="backward">
        <i class="fa-solid fa-chevron-left fs-5"></i>
      </a-button>
    </div>

    <div class="account-manager-transparent-card">
      <a-flex>
        <h3 class="text-white fs-1">Tạo phòng ban</h3>
      </a-flex>
    </div>

    <a-card class="account-manager-card" :bordered="false">
      <a-skeleton :loading="pageLoading" active>
        <p class="fs-5 fw-bold">Đặt tên phòng ban</p>
        <a-divider vertical style="border-color: #fff"></a-divider>
        <a-form
          class="white-text-form"
          :hideRequiredMark="true"
          autocomplete="off"
          layout="vertical"
          ref="departmentFormRef"
          name="basic"
          :model="departmentForm"
          :rules="departmentFormRules">
          <a-form-item name="departmentName" has-feedback>
            <template #label>
              <p class="fw-bold">Tên phòng ban</p>
            </template>
            <a-input :class="{ 'input-error': false }" v-model:value="departmentForm.departmentName" />
          </a-form-item>
        </a-form>
      </a-skeleton>
    </a-card>
    <a-card class="account-manager-card" :bordered="false">
      <a-skeleton :loading="pageLoading" active>
        <a-table
          class="account-manager-table"
          rowKey="id"
          :row-selection="{ selectedRowKeys: userTableState.selectedRowKeys, onChange: onUserSelectChange }"
          :columns="userColumns"
          :data-source="userDataSource"
          :loading="userTableLoading"
          :bordered="false"
          :showSorterTooltip="false"
          :expand-column-width="100"
          :scroll="{ x: true }">
          <template #title>
            <a-row>
              <a-col flex="1 1 300px">
                <p class="fs-5 fw-bold">
                  Thêm người dùng vào phòng ban - <i>Tuỳ chọn</i> <span style="color: lightgray">(2)</span>
                </p>
              </a-col>
              <a-col flex="">
                <a-flex gap="middle">
                  <a-button class="ps-3 pe-3 fw-bold" type="default" ghost @click="reloadTable">
                    <i class="fa-solid fa-rotate-right"></i>
                  </a-button>
                </a-flex>
              </a-col>
            </a-row>
            <a-row>
              <a-col class="mt-1" :xs="24"> </a-col>
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

            <template v-else-if="column.key === 'created'">
              <span>{{ myGetLastTime(record.created_at) }}</span>
            </template>
          </template>
        </a-table>
      </a-skeleton>
    </a-card>
    <a-card class="account-manager-card" :bordered="false">
      <a-skeleton :loading="pageLoading" active>
        <a-table
          class="account-manager-table"
          rowKey="id"
          :row-selection="{ selectedRowKeys: policyTableState.selectedRowKeys, onChange: onPolicySelectChange }"
          :columns="policyColumns"
          :data-source="policyDataSource"
          :loading="policyTableLoading"
          :bordered="false"
          :showSorterTooltip="false"
          :expand-column-width="100"
          :scroll="{ x: true }">
          <template #title>
            <a-row>
              <a-col flex="1 1 300px">
                <p class="fs-5 fw-bold">Gán quyền hạn - <i>Tuỳ chọn</i> <span style="color: lightgray">(2)</span></p>
              </a-col>
              <a-col flex="">
                <a-flex gap="middle">
                  <a-button class="ps-3 pe-3 fw-bold" type="default" ghost @click="reloadTable">
                    <i class="fa-solid fa-rotate-right"></i>
                  </a-button>
                </a-flex>
              </a-col>
            </a-row>
            <a-row>
              <a-col class="mt-1" :xs="24"> </a-col>
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

            <template v-else-if="column.key === 'created'">
              <span>{{ myGetLastTime(record.created_at) }}</span>
            </template>
          </template>
        </a-table>
      </a-skeleton>
    </a-card>

    <div class="account-manager-transparent-card">
      <a-skeleton :loading="pageLoading" active>
        <a-flex class="p-2 pe-0 mb-3" align="center" justify="right" gap="large">
          <a-button type="default" shape="round" size="large" @click="backward">Huỷ</a-button>

          <a-button type="primary" shape="round" size="large" @click="save">Tạo phòng ban</a-button>
        </a-flex>
      </a-skeleton>
    </div>
  </a-flex>
</template>

<script>
import { defineComponent, ref, inject, reactive } from 'vue';
import { getLastTime } from '@/js/utils/utils.js';
import thuyLoiApi from '@/js/axios/thuyLoiApi';
import { userState } from '@/stores/user-state';
import { getItem, setItem, removeItem } from '@/js/utils/localStorage';

export default defineComponent({
  setup() {
    const pageLoading = inject('pageLoading');
    const pageSpinning = inject('pageSpinning');
    const departmentForm = reactive({
      departmentName: '',
    });
    const departmentFormRef = ref();

    const nameValidator = async (_rule, value) => {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (nameRegex.test(value)) {
        return Promise.resolve();
      } else {
        return Promise.reject('Tên phòng ban không hợp lệ!');
      }
    };

    const departmentFormRules = {
      departmentName: [
        {
          validator: nameValidator,
          trigger: ['blur', 'change'],
        },
      ],
    };

    const userTableState = reactive({
      selectedRowKeys: [],
    });

    const policyTableState = reactive({
      selectedRowKeys: [],
    });

    const onUserSelectChange = (selectedRowKeys) => {
      userTableState.selectedRowKeys = selectedRowKeys;
    };

    const onPolicySelectChange = (selectedRowKeys) => {
      policyTableState.selectedRowKeys = selectedRowKeys;
    };
    const myGetLastTime = getLastTime;
    const policyDataSource = ref([
      {
        key: '1',
        name: 'Mike',
        age: 32,
        address: '10 Downing Street',
      },
      {
        key: '2',
        name: 'John',
        age: 42,
        address: '10 Downing Street',
      },
    ]);
    return {
      pageLoading,
      pageSpinning,
      departmentForm,
      departmentFormRef,
      departmentFormRules,
      userTableState,
      onUserSelectChange,
      myGetLastTime,
      policyTableState,
      onPolicySelectChange,
      policyDataSource,
    };
  },

  data() {
    return {
      userTableLoading: false,
      policyTableLoading: false,
      userDataSource: [
        {
          key: '1',
          name: 'Mike',
          age: 32,
          address: '10 Downing Street',
        },
        {
          key: '2',
          name: 'John',
          age: 42,
          address: '10 Downing Street',
        },
      ],
      userColumns: [
        {
          title: 'Tên người dùng',
          dataIndex: 'name',
          key: 'name',
          sorter: (a, b) => a.name.length - b.name.length,
        },
        {
          title: 'Ngày được tạo',
          dataIndex: 'created',
          key: 'created',
          sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
          width: 150,
        },
      ],
      policyColumns: [
        {
          title: 'Tên quyền hành',
          dataIndex: 'name',
          key: 'name',
          sorter: (a, b) => a.name.length - b.name.length,
        },
        {
          title: 'Mô tả',
          dataIndex: 'description',
          key: 'description',
          sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
        },
      ],
    };
  },

  computed: {},

  methods: {
    backward() {
      this.$router.push({ name: 'account-manager-departments' });
    },

    reloadTable() {},

    save() {},
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
