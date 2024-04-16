import { defineStore } from 'pinia';

export const userState = defineStore('userStateId', {
  state: () => ({
    loginState: false,
    userProfile: null,
  }),

  actions: {
    onAuthentication(userProfile, avatar) {
      this.loginState = true;
      this.userProfile = userProfile;
      this.userProfile.avatar_base64 = avatar;
    },
    onLogout() {
      this.loginState = false;
      this.userProfile = null;
    },
  },

  getters: {
    getLogin() {
      return this.loginState;
    },
    getUserProfile() {
      return this.userProfile;
    },
  },
});
