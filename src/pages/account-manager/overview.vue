<template>
  <a-flex vertical gap="20" align="center">
    <a-card :bordered="false" class="account-manager-card">
      <a-skeleton :loading="pageLoading" active>
        <p class="fs-3 fw-bold mb-1 text-white">{{ userProfile.name }}</p>
        <a-row>
          <a-col flex="1 1 300px">
            <a-skeleton :loading="pageLoading" active>
              <span>
                <p class="fw-bold mt-1">Đơn vị:</p>
                <p>{{ userProfile.organization_name }}</p>
              </span>
              <span>
                <p class="fw-bold mt-1">Phòng ban:</p>
                <p>{{ userProfile.department_name }}</p>
              </span>
            </a-skeleton>
          </a-col>
          <a-col flex="1 0 200px" style="padding: 10px 0 0 20px">
            <a-skeleton :loading="pageLoading" active avatar>
              <a-image v-if="avatar" style="width: 250px; height: auto" :src="avatar" />
              <img v-else style="width: 250px; height: auto" src="../../assets/page-image/no_avatar.jpg" />
            </a-skeleton>
          </a-col>
        </a-row>
      </a-skeleton>
    </a-card>
    <a-card :bordered="false" class="account-manager-card">
      <p class="fs-3 fw-bold mb-4">Tài khoản</p>
      <a-flex vertical :gap="8">
        <router-link :to="{ name: 'account-manager-edit-user-info' }">
          <a-button
            class="no-border-ant-button background-hover-button fs-6"
            ghost
            block
            style="height: auto; padding: 15px">
            <a-row justify="space-between" align="middle">
              <a-col class="center-col">
                <i class="fa-solid fa-pen me-3 fs-4" style="width: 30px"></i>
                <p class="fw-bold">Chỉnh sửa hồ sơ</p>
              </a-col>
              <a-col class="center-col">
                <i class="fa-solid fa-angles-right"></i>
              </a-col>
            </a-row>
          </a-button>
        </router-link>

        <a-button
          class="no-border-ant-button background-hover-button fs-6"
          ghost
          block
          style="height: auto; padding: 15px">
          <a-row justify="space-between" align="middle">
            <a-col class="center-col">
              <i class="fa-solid fa-image-portrait me-3 fs-4" style="width: 30px"></i>
              <p class="fw-bold">Đổi ảnh đại diện</p>
            </a-col>
            <a-col class="center-col">
              <i class="fa-solid fa-angles-right"></i>
            </a-col>
          </a-row>
        </a-button>

        <a-button
          class="no-border-ant-button background-hover-button fs-6"
          ghost
          block
          style="height: auto; padding: 15px">
          <a-row justify="space-between" align="middle">
            <a-col class="center-col">
              <i class="fa-solid fa-lock me-3 fs-4" style="width: 30px"></i>
              <p class="fw-bold">Đổi mật khẩu</p>
            </a-col>
            <a-col class="center-col">
              <i class="fa-solid fa-angles-right"></i>
            </a-col>
          </a-row>
        </a-button>
        <a-button
          class="no-border-ant-button background-hover-button fs-6"
          ghost
          block
          style="height: auto; padding: 15px">
          <a-row justify="space-between" align="middle">
            <a-col class="center-col">
              <i class="fa-solid fa-comment-dots me-3 fs-4" style="width: 30px"></i>
              <p class="fw-bold">Yêu cầu quyền truy cập</p>
            </a-col>
            <a-col class="center-col">
              <i class="fa-solid fa-angles-right"></i>
            </a-col>
          </a-row>
        </a-button>
      </a-flex>
    </a-card>

    <a-card :bordered="false" class="account-manager-card">
      <p class="fs-3 fw-bold mb-4">Tài khoản</p>
      <a-flex vertical :gap="8">
        <a-button
          class="no-border-ant-button background-hover-button fs-6"
          ghost
          block
          style="height: auto; padding: 15px">
          <a-row justify="space-between" align="middle">
            <a-col class="center-col">
              <i class="fa-solid fa-pen me-3 fs-4" style="width: 30px"></i>

              <p class="fw-bold">Chỉnh sửa hồ sơ</p>
            </a-col>
            <a-col class="center-col">
              <i class="fa-solid fa-angles-right"></i>
            </a-col>
          </a-row>
        </a-button>
        <a-button
          class="no-border-ant-button background-hover-button fs-6"
          ghost
          block
          style="height: auto; padding: 15px">
          <a-row justify="space-between" align="middle">
            <a-col class="center-col">
              <i class="fa-solid fa-location-dot me-3 fs-4" style="width: 30px"></i>
              <p class="fw-bold">Địa chỉ</p>
            </a-col>
            <a-col class="center-col">
              <i class="fa-solid fa-angles-right"></i>
            </a-col>
          </a-row>
        </a-button>
        <a-button
          class="no-border-ant-button background-hover-button fs-6"
          ghost
          block
          style="height: auto; padding: 15px">
          <a-row justify="space-between" align="middle">
            <a-col class="center-col">
              <i class="fa-solid fa-lock me-3 fs-4" style="width: 30px"></i>
              <p class="fw-bold">Đổi mật khẩu</p>
            </a-col>
            <a-col class="center-col">
              <i class="fa-solid fa-angles-right"></i>
            </a-col>
          </a-row>
        </a-button>
      </a-flex>
    </a-card>
    <a-card :bordered="false" class="account-manager-card">
      <p class="fs-3 fw-bold mb-4">Tài khoản</p>
      <a-flex vertical :gap="8">
        <a-button
          class="no-border-ant-button background-hover-button fs-6"
          ghost
          block
          style="height: auto; padding: 15px">
          <a-row justify="space-between" align="middle">
            <a-col class="center-col">
              <i class="fa-solid fa-pen me-3 fs-4" style="width: 30px"></i>
              <p class="fw-bold">Chỉnh sửa hồ sơ</p>
            </a-col>
            <a-col class="center-col">
              <i class="fa-solid fa-angles-right"></i>
            </a-col>
          </a-row>
        </a-button>
        <a-button
          class="no-border-ant-button background-hover-button fs-6"
          ghost
          block
          style="height: auto; padding: 15px">
          <a-row justify="space-between" align="middle">
            <a-col class="center-col">
              <i class="fa-solid fa-location-dot me-3 fs-4" style="width: 30px"></i>
              <p class="fw-bold">Địa chỉ</p>
            </a-col>
            <a-col class="center-col">
              <i class="fa-solid fa-angles-right"></i>
            </a-col>
          </a-row>
        </a-button>
        <a-button
          class="no-border-ant-button background-hover-button fs-6"
          ghost
          block
          style="height: auto; padding: 15px">
          <a-row justify="space-between" align="middle">
            <a-col class="center-col">
              <i class="fa-solid fa-lock me-3 fs-4" style="width: 30px"></i>
              <p class="fw-bold">Đổi mật khẩu</p>
            </a-col>
            <a-col class="center-col">
              <i class="fa-solid fa-angles-right"></i>
            </a-col>
          </a-row>
        </a-button>
      </a-flex>
    </a-card>
  </a-flex>
</template>

<script>
import { defineComponent, inject } from 'vue';

export default defineComponent({
  setup() {
    const pageLoading = inject('pageLoading');
    const userProfile = inject('userProfile');
    const avatar = inject('avatar');
    return {
      pageLoading,
      userProfile,
      avatar,
    };
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  mounted() {},
});
</script>

<style lang="scss"></style>
