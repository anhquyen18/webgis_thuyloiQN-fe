import { defineStore } from 'pinia';

export const userState = defineStore('userStateId', {
  state: () => ({
    loginState: false,
    userProfile: null,
    departments: null,
    noDepartmentUsers: null,
    userPolicies: null,
    availablePolcies: null,
    organizations: null,
  }),

  actions: {
    onAuthentication(userProfile) {
      this.loginState = true;
      this.userProfile = userProfile;
    },
    onLogout() {
      this.loginState = false;
      this.userProfile = null;
    },
    setDepartments(departments) {
      this.departments = departments;
    },
    setNoDepartmentUsers(users) {
      this.noDepartmentUsers = users;
    },
    setAvailablePolcies(availablePolcies) {
      this.availablePolcies = availablePolcies;
    },
    setOrganizations(organizations) {
      this.organizations = organizations;
    },
  },

  getters: {
    getLogin() {
      return this.loginState;
    },
    getUserProfile() {
      return this.userProfile;
    },
    getDepartments() {
      return this.departments;
    },
    getNoDepartmentUsers() {
      return this.noDepartmentUsers;
    },
    getAvailablePolcies() {
      return this.availablePolcies;
    },
    getOrganizations() {
      return this.organizations;
    },
  },
});
