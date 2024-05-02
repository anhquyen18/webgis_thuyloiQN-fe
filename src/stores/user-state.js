import { defineStore } from 'pinia';

export const userState = defineStore('userStateId', {
  state: () => ({
    loginState: false,
    userProfile: null, // Hứng data người đăng nhập được gửi về từ server
    departments: null, // Các department có thể gán cho người khác
    noDepartmentUsers: null, // Những người dùng chưa được gán department
    availablePolicies: null, // Các quyền có thể gán cho người khác
    organizations: null, // Các tổ chức có thể gán cho người khác
    myDepartment: null, // Thông tin về department của page account-manager-department-detail
    users: null, // Tất cả user mà user hiện tại có quyền quản lí
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
    setAvailablePolicies(availablePolicies) {
      this.availablePolicies = availablePolicies;
    },
    setOrganizations(organizations) {
      this.organizations = organizations;
    },
    setMyDepartment(myDepartment) {
      this.myDepartment = myDepartment;
    },
    setUsers(users) {
      this.users = users;
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
    getAvailablePolicies() {
      return this.availablePolicies;
    },
    getOrganizations() {
      return this.organizations;
    },
    getMyDepartment() {
      return this.myDepartment;
    },
    getUsers() {
      return this.users;
    },
  },
});
