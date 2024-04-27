import { defineStore } from 'pinia';

export const userState = defineStore('userStateId', {
  state: () => ({
    loginState: false,
    userProfile: null, // Hứng data người đăng nhập được gửi về từ server
    departments: null, // Các department có thể gán cho người khác
    noDepartmentUsers: null, // Những người dùng chưa được gán department
    availablePolcies: null, // Các quyền có thể gán cho người khác
    organizations: null, // Các tổ chức có thể gán cho người khác
    myDepartment: null, // Thông tin về department của user
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
    setMyDepartment(myDepartment) {
      this.myDepartment = myDepartment;
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
    getMyDepartment() {
      return this.myDepartment;
    },
  },
});
