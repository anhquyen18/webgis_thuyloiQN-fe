<template>
  <a-flex vertical gap="20" align="center" flex="1">
    <div class="account-manager-transparent-card">
      <a-button type="primary" shape="circle" size="large" style="height: 50px; width: 50px" @click="backward">
        <i class="fa-solid fa-chevron-left fs-5"></i>
      </a-button>
    </div>

    <div class="account-manager-transparent-card">
      <a-skeleton :loading="profileLoading" active>
        <a-flex>
          <h3 v-if="userProfile" class="text-white fs-3">
            Chỉnh sửa hồ sơ <i v-if="userProfile"> {{ userProfile.name }}</i>
          </h3>
          <a-flex v-else>
            <h3 class="text-white fs-3">Không tìm thấy người dùng</h3>
          </a-flex>
        </a-flex>
      </a-skeleton>

      <a-skeleton :loading="profileLoading" active>
        <a-form
          v-if="userProfile"
          class="white-text-form"
          layout="vertical"
          :model="editUserInfoForm"
          name="editUserInfoForm"
          :rules="editUserInfoRules"
          ref="editUserInfoFormRef"
          hideRequiredMark>
          <a-form-item class="mt-4">
            <template #label>
              <p class="fw-bold text-white me-2">Tên tài khoản</p>
            </template>
            <p>{{ userProfile.username }}</p>
          </a-form-item>

          <a-form-item class="mt-3">
            <template #label>
              <p class="fw-bold" name="status_id">Trạng thái tài khoản</p>
            </template>
            <a-select
              v-model:value="editUserInfoForm.status_id"
              size="large"
              :options="statusOptions"
              style="width: 100%">
            </a-select>
          </a-form-item>

          <a-form-item class="mt-3" name="name">
            <template #label>
              <p class="fw-bold text-white">Tên người dùng</p>
            </template>
            <a-input v-model:value="editUserInfoForm.name" size="large" placeholder="Tên người dùng"></a-input>
          </a-form-item>

          <a-form-item class="mt-3" name="email">
            <template #label>
              <p class="fw-bold text-white">Email</p>
            </template>
            <a-input v-model:value="editUserInfoForm.email" size="large" placeholder="Email"></a-input>
          </a-form-item>

          <a-form-item class="mt-3" name="phoneNumber">
            <template #label>
              <p class="fw-bold text-white">Số điện thoại</p>
            </template>
            <a-input v-model:value="editUserInfoForm.phone_number" size="large" placeholder="Số điện thoại" />
          </a-form-item>

          <a-form-item class="mt-3">
            <template #label>
              <p class="fw-bold text-white">Mật khẩu</p>
            </template>
            <a-input-password size="large" disabled></a-input-password>
          </a-form-item>

          <a-form-item class="mt-3">
            <template #label>
              <p class="fw-bold" name="gender">Giới tính</p>
            </template>
            <a-select v-model:value="editUserInfoForm.gender" size="large" :options="genderOptions" style="width: 100%">
            </a-select>
          </a-form-item>

          <a-row class="mt-3" :gutter="[16, 8]">
            <a-col :flex="1">
              <a-form-item name="dayOfBirth">
                <template #label>
                  <p class="fw-bold">Ngày sinh</p>
                </template>
                <a-input v-model:value="editUserInfoForm.dayOfBirth" size="large"> </a-input>
              </a-form-item>
            </a-col>

            <a-col :flex="12">
              <a-form-item name="monthOfBirth">
                <template #label>
                  <p class="fw-bold">&nbsp;</p>
                </template>
                <a-select v-model:value="editUserInfoForm.monthOfBirth" :options="monthOptions" size="large">
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :flex="1">
              <a-form-item name="yearOfBirth">
                <template #label>
                  <p class="fw-bold">&nbsp;</p>
                </template>
                <a-input v-model:value="editUserInfoForm.yearOfBirth" size="large"> </a-input>
              </a-form-item>
            </a-col>
          </a-row>

          <a-form-item v-if="!!allAccessOrgnizations()" class="mt-3">
            <template #label>
              <p class="fw-bold">Tổ chức</p>
            </template>
            <a-select
              v-model:value="editUserInfoForm.organization_id"
              size="large"
              :field-names="{ label: 'name', value: 'id' }"
              :options="organizationOptions"
              @change="onOrganizationSelectChange"
              :loading="organizationSelectLoading"
              :disabled="organizationSelectLoading"
              allowClear
              style="width: 100%">
            </a-select>
          </a-form-item>

          <a-form-item class="mt-3">
            <template #label>
              <p class="fw-bold">Phòng ban</p>
            </template>
            <a-select
              v-model:value="editUserInfoForm.department_id"
              size="large"
              :field-names="{ label: 'name', value: 'id' }"
              :options="departmentOptions"
              :loading="organizationSelectLoading"
              :disabled="organizationSelectLoading"
              allowClear
              style="width: 100%">
            </a-select>
          </a-form-item>
        </a-form>
      </a-skeleton>
    </div>

    <a-card class="account-manager-card" :bordered="false">
      <a-skeleton :loading="profileLoading" active>
        <a-tabs :activeKey="tabActiveKey" @change="tabChange">
          <a-tab-pane key="assigned">
            <template #tab> Quyền hạn hiện tại ({{ this.assignedOriginDataSource.length }}) </template>
            <a-table
              class="account-manager-table"
              rowKey="id"
              :row-selection="{ selectedRowKeys: assignedSelectedRowKeys, onChange: onAssignedSelectChange }"
              :columns="policyColumns"
              :data-source="assignedDataSource"
              :loading="profileLoading"
              :bordered="false"
              :showSorterTooltip="false"
              :expand-column-width="100"
              :scroll="{ x: true }">
              <template #title>
                <a-row>
                  <a-col flex="1 1 300px">
                    <p>Những quyền được gán thẳng đến người dùng hiện tại.</p>
                  </a-col>
                  <a-col flex="">
                    <a-flex gap="middle">
                      <a-button class="account-manager-text-ant-button" type="default" ghost @click="reloadProfile">
                        <i class="fa-solid fa-rotate-right"></i>
                      </a-button>
                    </a-flex>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col class="mt-1" :xs="24">
                    <Transition name="slide-fade" :duration="150">
                      <a-tag
                        v-show="assignedSelectedRowKeys.length > 0"
                        :bordered="false"
                        color="error"
                        style="text-wrap: wrap">
                        Những quyền hạn được chọn sẽ được xoá khỏi người dùng này.
                      </a-tag>
                    </Transition>
                  </a-col>
                  <a-col :xs="24" :md="16">
                    <a-input
                      v-model:value="assignedSearchValue"
                      class="mt-2"
                      placeholder="Tìm kiếm"
                      @change="assignedSearchChange">
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
              </template>
            </a-table>
          </a-tab-pane>

          <a-tab-pane key="not-assigned" force-render>
            <template #tab> Thêm quyền hạn ({{ notAssignedOriginDataSource.length }}) </template>
            <a-table
              class="account-manager-table"
              rowKey="id"
              :row-selection="{ selectedRowKeys: notAssignedSelectedRowKeys, onChange: onNotAssignedSelectChange }"
              :columns="policyColumns"
              :data-source="notAssignedDataSource"
              :loading="profileLoading"
              :bordered="false"
              :showSorterTooltip="false"
              :expand-column-width="100"
              :scroll="{ x: true }">
              <template #title>
                <a-row>
                  <a-col flex="1 1 300px">
                    <p>Những quyền hạn sẵn sàng gán cho người dùng.</p>
                  </a-col>
                  <a-col flex="">
                    <a-flex gap="middle">
                      <a-button class="ps-3 pe-3 fw-bold" type="default" ghost @click="reloadProfile">
                        <i class="fa-solid fa-rotate-right"></i>
                      </a-button>
                    </a-flex>
                  </a-col>
                </a-row>
                <a-row>
                  <a-col class="mt-1" :xs="24">
                    <Transition name="slide-fade" :duration="150">
                      <a-tag
                        v-show="notAssignedSelectedRowKeys.length > 0"
                        :bordered="false"
                        color="success"
                        style="text-wrap: wrap">
                        Những quyền hạn được chọn sẽ được gán cho người dùng.
                      </a-tag>
                    </Transition>
                  </a-col>
                  <a-col :xs="24" :md="16">
                    <a-input
                      v-model:value="notAssignedSearchValue"
                      class="mt-2"
                      placeholder="Tìm kiếm"
                      @change="notAssignedSearchChange">
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
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </a-skeleton>
    </a-card>

    <div class="account-manager-transparent-card">
      <a-skeleton :loading="profileLoading" active>
        <a-flex class="p-5 pe-0" align="center" justify="right" gap="large">
          <a-button type="default" shape="round" size="large" @click="backward">Huỷ</a-button>

          <a-button type="primary" shape="round" size="large" :loading="saveLoading" @click="save">Lưu hồ sơ</a-button>
        </a-flex>
      </a-skeleton>
    </div>
  </a-flex>
</template>

<script>
import { defineComponent, ref, inject } from 'vue';
import { userState } from '@/stores/user-state';
import thuyLoiApi from '@/js/axios/thuyLoiApi';
import { getItem } from '@/js/utils/localStorage.js';
import { useRouter } from 'vue-router';
import { removeAccents } from '@/js/utils/utils';

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    next((data) => {
      window.scrollTo(0, 0);
    });
  },

  setup() {
    const pageLoading = inject('pageLoading');
    const loggedUserProfile = inject('userProfile');
    const profileLoading = ref(true);
    const saveLoading = ref(false);
    const router = useRouter();
    const userId = ref(router.currentRoute.value.params.id);
    const userProfile = ref();

    const organizationOptions = ref([]);
    const departmentOptions = ref([]);
    const organizationSelectLoading = ref(false);

    const assignedOriginDataSource = ref([]);
    const assignedDataSource = ref([]);
    const notAssignedOriginDataSource = ref([]);
    const notAssignedDataSource = ref([]);

    const getOrganizations = () => {
      organizationSelectLoading.value = true;
      thuyLoiApi
        .get(`/get-organizations`, {
          headers: {
            Authorization: `Bearer ${getItem('accessToken')}`,
          },
        })
        .then((response) => {
          userState().setOrganizations(response.data.organizations);
          organizationOptions.value = userState().getOrganizations;

          if (userProfile.value.organization_id) {
            organizationOptions.value.filter(function (obj) {
              if (obj.id == userProfile.value.organization_id) {
                departmentOptions.value = obj.departments;
                return;
              }
            });
          }

          organizationSelectLoading.value = false;
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const noOrganizationDepartments = ref();
    const getNoOrganizationDeparmtents = () => {
      organizationSelectLoading.value = true;
      thuyLoiApi
        .get(`/get-no-organization-departments`, {
          headers: {
            Authorization: `Bearer ${getItem('accessToken')}`,
          },
        })
        .then((response) => {
          noOrganizationDepartments.value = response.data.departments;
          if (!userProfile.value.organization_id) {
            departmentOptions.value = noOrganizationDepartments.value;
          }
          //   userState().setOrganizations(response.data.organizations);

          organizationSelectLoading.value = false;
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const getDepartmentsInOrganization = (organizationId) => {
      organizationSelectLoading.value = true;
      thuyLoiApi
        .get(`/organization/${organizationId}/departments`, {
          headers: {
            Authorization: `Bearer ${getItem('accessToken')}`,
          },
        })
        .then((response) => {
          // console.log(response.data);
          userState().setDepartments(response.data.departments);
          departmentOptions.value = userState().getDepartments;

          organizationSelectLoading.value = false;
        })
        .catch((error) => {
          console.log(error);
          organizationSelectLoading.value = false;
        });
    };

    const getUser = (id) => {
      profileLoading.value = true;
      thuyLoiApi
        .get(`/get-user-by-id/${id}`, {
          headers: {
            Authorization: `Bearer ${getItem('accessToken')}`,
          },
        })
        .then((response) => {
          console.log(response.data);

          userProfile.value = response.data.user;
          const {
            name,
            status_id,
            email,
            phone_number,
            gender,
            organization_id,
            department_id,
            birthday,
            policies,
            noPolicies,
          } = response.data.user;

          editUserInfoForm.value = {
            name,
            status_id,
            email,
            phone_number,
            gender,
            organization_id,
            department_id,
            dayOfBirth: '',
            monthOfBirth: '',
            yearOfBirth: '',
          };
          if (birthday) {
            editUserInfoForm.value.dayOfBirth = birthday.split('-')[2];
            editUserInfoForm.value.monthOfBirth = birthday.split('-')[1];
            editUserInfoForm.value.yearOfBirth = birthday.split('-')[0];
          }

          assignedOriginDataSource.value = policies;
          assignedDataSource.value = assignedOriginDataSource.value;
          notAssignedOriginDataSource.value = noPolicies;
          notAssignedDataSource.value = notAssignedOriginDataSource.value;

          profileLoading.value = false;
        })
        .catch((error) => {
          console.log(error);
          profileLoading.value = false;
        });
    };

    const editUserInfoFormRef = ref();
    const editUserInfoForm = ref({});

    const allAccessOrgnizations = () => {
      const allAccessOrganizationsPolicy = 2;
      return loggedUserProfile.value.allPolicies.find((policy) => policy.id === allAccessOrganizationsPolicy);
    };

    if (userState().getLogin) {
      getUser(userId.value);
      if (allAccessOrgnizations()) {
        getOrganizations();
        getNoOrganizationDeparmtents();
      } else {
        if (loggedUserProfile.value.organization_id != null) {
          getDepartmentsInOrganization(loggedUserProfile.value.organization_id);
        }
      }
    }

    const numberValidator = async (_rule, value) => {
      const phoneNumberRegex = /^\d{10}$/;
      const phoneNumberRegex1 = /^\d{11}$/;
      const numberRegex = /[^0-9]/;
      if (!value) {
      } else if (!numberRegex.test(value)) {
        return Promise.resolve();
      } else {
        return Promise.reject('Số điện thoại không hợp lệ!');
      }
    };

    const editUserInfoRules = {
      email: [
        {
          type: 'email',
          message: 'Email không hợp lệ!',
          trigger: 'change',
        },
      ],
      name: [
        {
          max: 50,
          message: 'Vui lòng nhập tên không quá 50 ký tự!',
          trigger: 'change',
        },
      ],
      phoneNumber: [
        {
          validator: numberValidator,
          trigger: 'change',
        },
      ],
      dayOfBirth: [
        {
          validator: numberValidator,
          trigger: 'change',
        },

        {
          max: 2,
          message: 'Ngày sinh không hợp lệ!',
          trigger: 'change',
        },
      ],

      yearOfBirth: [
        {
          validator: numberValidator,
          trigger: 'change',
        },

        {
          max: 4,
          min: 4,
          message: 'Năm sinh không hợp lệ!',
          trigger: 'change',
        },
      ],
    };

    const genderOptions = ref([
      {
        value: 'Nữ',
        label: 'Nữ',
      },
      {
        value: 'Nam',
        label: 'Nam',
      },
      {
        value: 'Khác',
        label: 'Khác',
      },
    ]);

    const monthOptions = ref([
      {
        value: '01',
        label: 'Tháng 1',
      },
      {
        value: '02',
        label: 'Tháng 2',
      },
      {
        value: '03',
        label: 'Tháng 3',
      },
      {
        value: '04',
        label: 'Tháng 4',
      },
      {
        value: '05',
        label: 'Tháng 5',
      },
      {
        value: '06',
        label: 'Tháng 6',
      },
      {
        value: '07',
        label: 'Tháng 7',
      },
      {
        value: '08',
        label: 'Tháng 8',
      },
      {
        value: '09',
        label: 'Tháng 9',
      },
      {
        value: '10',
        label: 'Tháng 10',
      },
      {
        value: '11',
        label: 'Tháng 11',
      },
      {
        value: '12',
        label: 'Tháng 12',
      },
    ]);

    const statusOptions = ref([
      {
        value: 1,
        label: 'Hoạt động',
      },
      {
        value: 2,
        label: 'Tạm khoá',
      },
      {
        value: 3,
        label: 'Hạn chế',
      },
    ]);

    return {
      loggedUserProfile,
      userProfile,
      userId,
      editUserInfoRules,
      editUserInfoFormRef,
      genderOptions,
      monthOptions,
      pageLoading,
      editUserInfoForm,
      saveLoading,
      statusOptions,
      organizationOptions,
      departmentOptions,
      getOrganizations,
      organizationSelectLoading,
      getUser,
      profileLoading,
      getNoOrganizationDeparmtents,
      noOrganizationDepartments,
      assignedDataSource,
      assignedOriginDataSource,
      notAssignedDataSource,
      notAssignedOriginDataSource,
      allAccessOrgnizations,
      getDepartmentsInOrganization,
    };
  },

  data() {
    return {
      tabActiveKey: 'assigned',
      assignedSelectedRowKeys: [],
      notAssignedSelectedRowKeys: [],
      policyColumns: [
        {
          title: 'Tên quyền hạn',
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

      assignedSearchValue: '',
      notAssignedSearchValue: '',
    };
  },

  watch: {
    pageLoading: {
      handler() {
        if (!this.pageLoading && !this.userProfile) {
          this.getUser(this.userId);

          if (this.allAccessOrgnizations()) {
            this.getOrganizations();
            this.getNoOrganizationDeparmtents();
          } else {
            if (this.loggedUserProfile.organization_id != null) {
              this.getDepartmentsInOrganization(this.loggedUserProfile.organization_id);
            }
          }
        } else {
          this.editUserInfoForm = {};
        }
      },
      deep: false,
      once: true,
    },
  },

  computed: {},

  methods: {
    backward() {
      this.$router.push({ name: 'account-manager-users' });
    },

    save() {
      this.saveLoading = true;
      this.editUserInfoFormRef
        .validate()
        .then((response) => {
          if (
            this.editUserInfoForm.yearOfBirth &&
            this.editUserInfoForm.monthOfBirth &&
            this.editUserInfoForm.dayOfBirth
          ) {
            this.editUserInfoForm.birthday =
              this.editUserInfoForm.yearOfBirth +
              '-' +
              this.editUserInfoForm.monthOfBirth +
              '-' +
              this.editUserInfoForm.dayOfBirth;
          } else {
            this.editUserInfoForm.birthday = '';
          }

          this.editUserInfoForm.removePolicies = this.assignedSelectedRowKeys;
          this.editUserInfoForm.addPolicies = this.notAssignedSelectedRowKeys;

          thuyLoiApi
            .put(`/users/update-user-profile/${this.userId}`, this.editUserInfoForm, {
              headers: {
                Authorization: `Bearer ${getItem('accessToken')}`,
              },
            })
            .then((response) => {
              // console.log(response);
              this.$message.success(response.data.message, 3);
              this.saveLoading = false;
              this.reloadProfile();
              this.assignedSelectedRowKeys = [];
              this.notAssignedSelectedRowKeys = [];
            })
            .catch((error) => {
              console.log(error);
              this.$message.error(error.response.data.message, 3);
              this.saveLoading = false;
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },

    onOrganizationSelectChange(value, option) {
      if (option) {
        this.departmentOptions = option.departments;
        this.editUserInfoForm.department_id = '';
      } else {
        this.departmentOptions = this.noOrganizationDepartments;
        this.editUserInfoForm.department_id = '';
      }
    },

    filterTable(text, dataSource) {
      return dataSource.filter(function (item) {
        return removeAccents(item.name.toLowerCase()).includes(removeAccents(text.toLowerCase()));
      });
    },

    assignedSearchChange() {
      this.assignedDataSource = this.filterTable(this.assignedSearchValue, this.assignedOriginDataSource);
    },

    notAssignedSearchChange() {
      this.notAssignedDataSource = this.filterTable(this.notAssignedSearchValue, this.notAssignedOriginDataSource);
    },

    onAssignedSelectChange(rowKeys) {
      this.assignedSelectedRowKeys = rowKeys;
    },

    onNotAssignedSelectChange(rowKeys) {
      this.notAssignedSelectedRowKeys = rowKeys;
    },

    tabChange(activeKey) {
      this.tabActiveKey = activeKey;
    },

    reloadProfile() {
      this.getUser(this.userId);
    },
  },

  mounted() {},
});
</script>

<style lang="scss"></style>
