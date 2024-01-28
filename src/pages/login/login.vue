<template>
  <a-spin :spinning="loginSpinning" size="large" tip="Xin vui lòng đợi...">
    <a-layout
      style="
        overflow: auto;
        height: 100vh;
        background: rgb(6, 0, 103);
        background: linear-gradient(153deg, rgba(6, 0, 103, 1) 0%, rgba(4, 96, 174, 1) 65%, rgba(0, 141, 170, 1) 100%);
      ">
      <a-layout-header style="background: transparent; height: 10vh; padding: 0; line-height: normal">
        <a-row style="height: 100%">
          <a-col class="center-col mt-3" :span="2">
            <a href="/">
              <img src="../../assets/Logo_BoNongNghiep.png" alt="" style="height: 5rem; width: 5rem" />
            </a>
          </a-col>
        </a-row>
      </a-layout-header>
      <a-layout-content style="height: 90vh">
        <a-row style="height: 100%" justify="center">
          <a-col :span="5">
            <h1 class="mb-5" style="font-size: 2rem; color: white">
              Đăng nhập <br /><span style="font-size: 1.5rem">Hệ thống quản lý công trình thuỷ lợi Quảng Nam</span>
            </h1>

            <a-flex
              v-if="this.loginErrors"
              class="mb-2"
              justify="left"
              align="center"
              style="
                background-color: var(--error-color);
                min-height: 50px;
                height: auto;
                padding: 5px 10px;
                color: #fff;
                font-weight: 500;
              ">
              <InfoCircleOutlined class="fs-5 me-3" />
              {{ this.loginErrors }}
            </a-flex>

            <a-form
              layout="vertical"
              :model="user"
              name="loginForm"
              :rules="loginFormRules"
              ref="loginFormRef"
              hideRequiredMark>
              <a-form-item name="username">
                <template #label>
                  <p class="form-item-title">Tên đăng nhập</p>
                </template>
                <a-input v-model:value="user.username" size="large" placeholder="Tên đăng nhập"></a-input>
              </a-form-item>
              <a-form-item class="mt-2" name="password">
                <template #label>
                  <p class="form-item-title">Mật khẩu</p>
                </template>
                <a-input-password
                  v-model:value="user.password"
                  size="large"
                  placeholder="Mật khẩu"
                  :visibility-toggle="false"></a-input-password>
              </a-form-item>

              <a-form-item class="mt-2">
                <a-flex horizontal align="center">
                  <a-checkbox v-model:checked="rememberme" size="small">
                    <p class="text-white ms-2">Lưu đăng nhập</p>
                  </a-checkbox>
                </a-flex>
              </a-form-item>

              <a-form-item class="mt-2">
                <a-button
                  class="fw-bold"
                  type="primary"
                  shape="round"
                  size="large"
                  block
                  html-type="submit"
                  @click="login">
                  Đăng nhập
                </a-button>
              </a-form-item>

              <a-form-item class="mt-4">
                <a-flex justify="center">
                  <a-button class="no-border-ant-button" ghost>
                    <p style="text-decoration: underline">Quên mật khẩu?</p>
                  </a-button>
                </a-flex>
              </a-form-item>

              <a-form-item class="mt-4">
                <a-divider style="border-color: var(--gray-color)" orientation="left"></a-divider>
              </a-form-item>

              <a-form-item class="mt-4">
                <a-flex justify="center" align="center">
                  <p class="me-2 text-white">Chưa có tài khoản?</p>

                  <router-link :to="{ name: 'signup-page' }">
                    <a-button class="no-border-ant-button" ghost @click="toSignup">
                      <p style="text-decoration: underline">Đăng ký tại đây</p>
                    </a-button>
                  </router-link>
                </a-flex>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
  </a-spin>

  <!-- <a-form
    :model="formState"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
    ref="loginFormRef"
    @finish="onFinish"
    @finishFailed="onFinishFailed">
    <a-form-item label="Username" name="username" :rules="[{ required: true, message: 'Please input your username!' }]">
      <a-input v-model:value="formState.username" />
    </a-form-item>

    <a-form-item label="Password" name="password" :rules="[{ required: true, message: 'Please input your password!' }]">
      <a-input-password v-model:value="formState.password" />
    </a-form-item>

    <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
      <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit" @click="submit">Submit</a-button>
    </a-form-item>
  </a-form> -->
</template>

<script>
import { defineComponent, ref } from 'vue';
import { userState } from '@/stores/user-state';
import { useRoute } from 'vue-router';
import thuyLoiApi from '@/js/axios/thuyLoiApi';
import { getCookie, setCookie } from '@/js/utils/cookie.js';
import { InfoCircleOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  components: {
    InfoCircleOutlined,
  },

  beforeRouteEnter(to, from, next) {
    if (getCookie('accessToken') === '') {
      next((data) => {});
    } else {
      // next((data) => {
      //   const getAuthenticatedUser = () => {
      //     thuyLoiApi
      //       .post(
      //         '/get-authenticated-user',
      //         {},
      //         {
      //           headers: {
      //             Authorization: `Bearer ${getCookie('accessToken')}`,
      //           },
      //         },
      //       )
      //       .then((response) => {
      //         if (response) {
      //           // console.log(response);
      //           userState().onAuthentication();
      //           data.homeSpinning = false;
      //           this.$router.push({ name: 'home-page' });
      //           setCookie('user', JSON.stringify(response.data.user));
      //         }
      //       })
      //       .catch((error) => {
      //         console.log(error);
      //         data.homeSpinning = false;
      //         setCookie('accessToken', '');
      //         setCookie('user', '');
      //         userState().onLogout();
      //       });
      //   };
      //   getAuthenticatedUser();
      // });

      const getAuthenticatedUser = () => {
        thuyLoiApi
          .post(
            '/get-authenticated-user',
            {},
            {
              headers: {
                Authorization: `Bearer ${getCookie('accessToken')}`,
              },
            },
          )
          .then((response) => {
            if (response) {
              // console.log(response);
              userState().onAuthentication();
              // this.$router.push({ name: 'home-page' });
              next({ name: 'home-page' });
              setCookie('user', JSON.stringify(response.data.user));
            }
          })
          .catch((error) => {
            console.log(error);
            setCookie('accessToken', '');
            setCookie('user', '');
            userState().onLogout();
            next((data) => {});
          });
      };
      getAuthenticatedUser();
    }
  },

  setup() {
    const user = ref({
      username: '',
      password: '',
      rememberme: false,
    });
    const rememberme = ref(false);
    const loginFormRules = {
      username: [
        {
          required: true,
          message: 'Vui lòng nhập tên đăng nhập.',
          trigger: 'change',
        },
      ],
      password: [
        {
          required: true,
          message: 'Vui lòng nhập mật khẩu.',
          trigger: 'change',
        },
      ],
    };
    const loginFormRef = ref();

    return {
      user,
      rememberme,
      loginFormRules,
      loginFormRef,
    };
  },

  data() {
    return {
      loginSpinning: false,
      loginErrors: '',
      loginValidateErrors: '',
    };
  },

  computed: {},

  methods: {
    login() {
      this.loginFormRef
        .validate()
        .then(() => {
          this.loginSpinning = true;
          thuyLoiApi
            .post('/login', this.user)
            .then((response) => {
              setCookie('accessToken', response.data.token);
              setCookie('user', JSON.stringify(response.data.user));
              // message.success('Sign in successfully!');
              userState().onAuthentication();
              this.loginSpinning = false;
              this.$router.push({ name: 'home-page' });
              // this.loginSpinning = false;
            })
            .catch((error) => {
              console.log(error);
              // if (error.response.status == 400) this.loginErrors = error.response.data.message;
              // else if (error.response.status == 422) this.loginValidateErrors = error.response.data.errors;
              this.loginErrors = error.response.data.message;
              // this.$message.error('Đăng nhập không thành công, vui lòng thử lại!');
              this.loginSpinning = false;
            });
        })
        .catch((error) => {
          console.log('error', error);
        });

      // .catch((error) => {
      //   console.log(error);
      // });

      // this.loginFormRef.validateFields();
    },

    toSignup() {},
  },

  mounted() {},
});
</script>

<style lang="scss">
.form-item-title {
  color: white;
  font-weight: bold;
}
</style>
