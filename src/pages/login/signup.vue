<template>
  <a-layout
    style="
      overflow: auto;
      height: 100vh;
      background: rgb(6, 0, 103);
      background: linear-gradient(220deg, rgba(6, 0, 103, 1) 0%, rgba(4, 96, 174, 1) 65%, rgba(0, 141, 170, 1) 100%);
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
        <!-- <a-col :span="15"> </a-col> -->
        <a-col :span="5">
          <h1 class="mb-5" style="font-size: 2rem; color: white">
            Đăng ký tài khoản <br /><span style="font-size: 1.5rem"
              >Hệ thống quản lý công trình thuỷ lợi Quảng Nam</span
            >
          </h1>
          <!-- <a-flex justify="center"> -->
          <a-form
            layout="vertical"
            :model="user"
            name="signupForm"
            :rules="signupFormRules"
            ref="signupFormRef"
            hideRequiredMark
            @submit="signup">
            <a-form-item name="username" hasFeedback>
              <template #label>
                <p class="form-item-title">Tên đăng nhập</p>
              </template>
              <a-input v-model:value="user.username" size="large" placeholder="Tên đăng nhập"></a-input>
            </a-form-item>

            <a-form-item class="mt-2" name="email" hasFeedback>
              <template #label>
                <p class="form-item-title">Email</p>
              </template>
              <a-input v-model:value="user.email" size="large" placeholder="Email"></a-input>
            </a-form-item>

            <a-form-item class="mt-2" name="password" hasFeedback>
              <template #label>
                <p class="form-item-title">Mật khẩu</p>
              </template>
              <a-input-password
                v-model:value="user.password"
                size="large"
                placeholder="Mật khẩu"
                :visibility-toggle="false"></a-input-password>
            </a-form-item>

            <a-form-item class="mt-2" name="confirmPassword" hasFeedback>
              <template #label>
                <p class="form-item-title">Nhập lại mật khẩu</p>
              </template>
              <a-input-password
                v-model:value="user.confirmPassword"
                size="large"
                placeholder="Nhập lại mật khẩu"
                :visibility-toggle="false"></a-input-password>
            </a-form-item>

            <a-form-item class="mt-5">
              <a-button class="fw-bold" type="primary" shape="round" size="large" html-type="submit" block>
                Đăng kí
              </a-button>
            </a-form-item>

            <a-form-item class="mt-4">
              <a-divider style="border-color: var(--gray-color)" orientation="left"></a-divider>
            </a-form-item>

            <a-form-item class="mt-4">
              <a-flex justify="center" align="center">
                <p class="me-2 text-white">Đã có tài khoản?</p>

                <router-link :to="{ name: 'login-page' }">
                  <a-button class="no-border-ant-button" ghost>
                    <p style="text-decoration: underline">Đăng nhập tại đây</p>
                  </a-button>
                </router-link>
              </a-flex>
            </a-form-item>
          </a-form>
          <!-- </a-flex> -->
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
      email: '',
      confirmPassword: '',
    });
    const signupFormRef = ref();

    const validatePass = async (_rule, value) => {
      if (value === '') {
        return Promise.reject('Vui lòng nhập mật khẩu');
      } else {
        if (user.value.password !== '') {
          signupFormRef.value.validateFields('confirmPassword');
        }
        return Promise.resolve();
      }
    };

    const validatePassConfirmPass = async (_rule, value) => {
      if (value === '') {
        return Promise.reject('Vui lòng xác nhận mật khẩu.');
      } else if (value !== user.value.password) {
        return Promise.reject('Mật khẩu không xác nhận chính xác.');
      } else {
        return Promise.resolve();
      }
    };
    const signupFormRules = {
      username: [
        {
          required: true,
          message: 'Vui lòng nhập tên đăng nhập.',
          trigger: 'change',
        },
        {
          min: 8,
          message: 'Tên người dùng ít nhất chứa 8 kí tự.',
          trigger: 'change',
        },
      ],
      password: [
        {
          validator: validatePass,
          trigger: 'change',
        },
        {
          min: 8,
          message: 'Mật khẩu ít nhất chứa 8 kí tự.',
          trigger: 'change',
        },
      ],
      confirmPassword: [
        {
          validator: validatePassConfirmPass,
          trigger: 'change',
        },
      ],
      email: [
        {
          required: true,
          message: 'Vui lòng nhập email.',
          trigger: 'change',
        },
        {
          type: 'email',
          message: 'Email không hợp lệ.',
          trigger: 'change',
        },
      ],
    };

    return {
      user,
      signupFormRules,
      signupFormRef,
    };
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    signup() {
      this.signupFormRef.validateFields();
    },
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
