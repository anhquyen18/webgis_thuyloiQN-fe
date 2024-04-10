<template>
  <a-layout
    style="
      background: rgb(6, 0, 103);
      background: linear-gradient(220deg, rgba(6, 0, 103, 1) 0%, rgba(4, 96, 174, 1) 65%, rgba(0, 141, 170, 1) 100%);
    ">
    <a-layout-header class="account-manager-header">
      <a-row style="height: 80%">
        <a-col class="all-h-100" :xs="0" :sm="{ span: 0, offset: 0 }" :xl="{ span: 3, offset: 2 }">
          <a-flex justify="left" align="center">
            <a href="/">
              <img class="ms-4" src="../assets/Logo_BoNongNghiep.ico" alt="" style="width: auto" />
            </a>
          </a-flex>
        </a-col>

        <a-col
          class="all-h-100"
          :xs="{ span: 16, offset: 0 }"
          :sm="{ span: 6, offset: 0 }"
          :xl="{ span: 0, offset: 0 }">
          <a-flex justify="left" align="center">
            <a href="/" style="height: 80%">
              <img class="ms-4" src="../assets/Logo_BoNongNghiep.ico" alt="" style="width: auto; height: 100%" />
            </a>
          </a-flex>
        </a-col>

        <a-col :xs="0" :sm="{ span: 10, offset: 2 }" :xl="{ span: 6, offset: 9 }">
          <a-flex class="h-100" justify="right" align="center">
            <a-button class="no-border-ant-button fw-bold fs-6 me-4" href="" ghost>Trang chủ</a-button>
            <a-button class="no-border-ant-button fw-bold fs-6 me-4" href="" ghost>Hỗ trợ</a-button>
            <a-button class="no-border-ant-button fw-bold fs-6" href="" ghost>Yêu cầu</a-button>
          </a-flex>
        </a-col>
        <a-col class="all-h-100" :xs="{ span: 0, offset: 0 }" :sm="{ span: 1, offset: 0 }" :xl="{ span: 1, offset: 0 }">
          <a-flex justify="center" align="center">
            <a-divider type="vertical" style="height: 20%; background-color: #fff; margin-top: 5px" />
          </a-flex>
        </a-col>

        <a-col
          :xs="{ span: 8, offset: 0 }"
          :sm="{ span: 3, offset: 0 }"
          :xl="{ span: 3, offset: 0 }"
          class="center-col"
          style="justify-content: left; padding-left: 25px">
          <a-popover
            trigger="click"
            :arrowPointAtCenter="true"
            placement="bottomRight"
            :align="{
              offset: [41, 5], // the offset sourceNode by 10px in x and 20px in y,
              overflow: { adjustX: true, adjustY: true },
            }">
            <a-button
              class="no-border-ant-button no-wave fw-bold fs-6 ms-4"
              ghost
              style="position: relative; box-shadow: none !important">
              <img class="account-manager-avatar" src="../assets/20230522_144015000_iOS.jpg" />
              Hồ sơ
              <i class="fa-solid fa-caret-down ms-2"></i>
            </a-button>

            <template #content>
              <a-flex vertical>
                <router-link :to="{ name: 'account-manager-page' }">
                  <a-button class="no-border-ant-button fw-bold"> Tài khoản </a-button>
                </router-link>

                <a-config-provider
                  :theme="{
                    token: {
                      colorTextBase: '#919496',
                    },
                  }">
                  <a-button class="no-border-ant-button fw-bold" @click="logout"> Đăng xuất </a-button>
                </a-config-provider>
              </a-flex>
            </template>
          </a-popover>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content>
      <a-flex vertical gap="20" align="center">
        <a-card :bordered="false" class="account-manager-card">
          <p class="fs-3 fw-bold mb-1 text-white">Trần Anh Quyền</p>
          <a-row>
            <a-col :xs="{ span: 24 }" :sm="{ span: 15 }">
              <span>
                <p class="fw-bold mt-1">Đơn vị:</p>
                <p>Trung tâm Nghiên cứu tài nguyên nước - Đại học Bách khoa Đà Nẵng</p>
              </span>
              <span>
                <p class="fw-bold mt-1">Phòng ban:</p>
                <p>Kỹ thuật</p>
              </span>

              <span>
                <p class="fw-bold mt-1">Chức vụ:</p>
                <p>Chuyên viên kỹ thuật</p>
              </span>
            </a-col>

            <a-col :span="9" style="padding: 10px 0 0 20px">
              <img style="width: 180px; height: 250px" src="../assets/20230522_144015000_iOS.jpg" />
            </a-col>
          </a-row>
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
    </a-layout-content>
  </a-layout>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    return {};
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    logout() {
      // userState().onLogout();
      removeItem('accessToken');
      removeItem('user');
      location.reload();
    },
  },

  mounted() {},
});
</script>

<style lang="scss">
.account-manager-header {
  background-color: transparent !important;
  height: 15vh !important;
  padding: 0 !important;
}

.account-manager-card {
  margin: 0 10px;
  background: rgb(27, 79, 175);
  background: linear-gradient(90deg, rgba(27, 79, 175, 1) 0%, rgba(58, 108, 200, 1) 100%); //#1b4faf, #3a6cc8
  color: white;
}

.account-manager-avatar {
  position: absolute;
  top: -2px;
  left: -45px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.background-hover-button {
  transition: 0.3s;
  &:hover {
    background-color: rgb(255, 255, 255) !important;
  }
}

@media (max-width: 576px) {
  .account-manager-card {
    // width: 90%;
    // background-color: red;
    width: calc(100% - 15px);

    // width: auto;
    margin: 0 10px;
    // width: fit-content;
  }
}

@media (min-width: 576px) {
  .account-manager-card {
    // width: 90%;
    // background-color: red;
    width: 80%;
  }
}

// @media only screen and (min-width: 768px) {
//   .account-manager-card {
//     max-width: calc(100% / 2 - 10px); /* -10 px accounts for margin: 5px; */
//   }
// }

@media (min-width: 1200px) {
  .account-manager-card {
    width: 50%;
  }
}
</style>
