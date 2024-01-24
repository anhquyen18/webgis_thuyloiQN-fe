<template>
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

          <a-form
            layout="vertical"
            :model="user"
            name="loginForm"
            :rules="loginFormRules"
            ref="loginFormRef"
            hideRequiredMark
            @submit.prevent="login()">
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
                <a-checkbox v-model:checked="user.rememberme" size="small">
                  <p class="text-white ms-2">Lưu đăng nhập</p>
                </a-checkbox>
              </a-flex>
            </a-form-item>

            <a-form-item class="mt-2">
              <a-button class="fw-bold" type="primary" shape="round" size="large" html-type="submit" block>
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
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const user = ref({
      username: '',
      password: '',
      rememberme: false,
    });
    const validateSignIn = async (_rule, value) => {
      if (signInUser.value.username === '' || signInUser.value.password === '') {
        signInButtonDisable.value = true;
      } else {
        signInButtonDisable.value = false;
      }
    };
    const loginFormRules = {
      username: [
        {
          required: true,
          message: 'Vui lòng nhập tên đăng nhập.',
          // validator: validateSignIn,
          trigger: 'change',
        },
      ],
      password: [
        {
          required: true,
          message: 'Vui lòng nhập mật khẩu.',
          // validator: validateSignIn,
          trigger: 'change',
        },
      ],
    };
    const loginFormRef = ref();

    const login = () => {
      console.log('anhquyendeptraivcl');
    };
    return {
      user,
      loginFormRules,
      loginFormRef,
    };
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    login() {
      console.log('anhueyaikdhjasjikdhsa');
      this.loginFormRef.validateFields();
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
