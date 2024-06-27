<template>
  <div class="sign-in-button-panel">
    <a-row v-if="loginState" class="sign-in-button-panel--unlogged" style="width: 60px">
      <a-col :span="4" :offset="4">
        <a-popover trigger="click" :arrowPointAtCenter="true" placement="bottomRight">
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
          <a-button class="no-border-ant-button" size="small" ghost>
            <a-flex jutify="center" align="center">
              <i class="fa-regular fa-circle-user fs-5"></i>
              <i class="fa-solid fa-chevron-down ms-2" style="font-size: 0.6rem"></i>
            </a-flex>
          </a-button>
        </a-popover>
      </a-col>

      <!-- <a-col :span="10">
        <a-button class="" size="small" shape="circle" ghost>
          <i class="fa-regular fa-user"></i>
        </a-button>
      </a-col> -->
    </a-row>

    <a-row v-else class="sign-in-button-panel--logged" justify="space-between" style="padding: 0 5px">
      <a-col :xs="{ span: 0, offset: 0 }" :sm="{ span: 10, offset: 2 }" :xl="{ span: 10, offset: 0 }">
        <router-link :to="{ name: 'login-page' }">
          <a-button class="no-border-ant-button fw-bold" size="small" ghost> Đăng nhập </a-button>
        </router-link>
      </a-col>
      <a-col :xs="{ span: 24, offset: 0 }" :sm="{ span: 0, offset: 0 }" :xl="{ span: 0, offset: 0 }">
        <router-link :to="{ name: 'login-page' }">
          <a-button class="no-border-ant-button" size="small" ghost>
            <i class="fa-solid fa-right-to-bracket"></i>
          </a-button>
        </router-link>
      </a-col>
      <a-col class="ms-2" :xs="{ span: 0, offset: 0 }" :sm="{ span: 9, offset: 0 }" :xl="{ span: 9, offset: 0 }">
        <router-link :to="{ name: 'signup-page' }">
          <a-button class="no-border-ant-button fw-bold" size="small" ghost>Đăng ký</a-button>
        </router-link>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { userState } from '@/stores/user-state';
import { getItem, setItem, removeItem } from '@/js/utils/localStorage.js';
import { Grid } from 'ant-design-vue';

export default defineComponent({
  setup() {
    const useBreakpoint = Grid.useBreakpoint;
    const screens = useBreakpoint();
    return {
      screens,
    };
  },

  data() {
    return {};
  },

  computed: {
    loginState: function () {
      return userState().getLogin;
    },
  },

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
.sign-in-button-panel {
  // width: auto;
  // height: 3vh;
  position: fixed;
  top: 0;
  right: 0;

  &--logged {
    clip-path: polygon(0 0, 100% 0%, 100% 100%, 10% 100%);
    background: rgb(2, 0, 36);
    background: linear-gradient(167deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 16%, rgba(0, 212, 255, 1) 100%);
  }
  &--unlogged {
    clip-path: polygon(0 0, 100% 0%, 100% 100%, 30% 100%);
    background: rgb(2, 0, 36);
    background: linear-gradient(167deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 16%, rgba(0, 212, 255, 1) 100%);
  }
}
</style>
