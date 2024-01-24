import { defineStore } from 'pinia';

export const userState = defineStore('userStateId', {
  state: () => ({
    loginState: false,
  }),

  actions: {
    onAuthentication() {
      this.loginState = true;
    },
    onLogOut() {
      this.loginState = false;
    },
  },

  getters: {
    getLogin() {
      return this.loginState;
    },
  },
});
