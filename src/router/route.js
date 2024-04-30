const home = [
  {
    path: '/',
    name: 'home-page',
    component: () => import('../layouts/home.vue'),
    meta: { title: 'Hệ thống quản lý công trình thủy lợi Quảng Nam' },
  },
  {
    path: '/login',
    name: 'login-page',
    component: () => import('../pages/login/login.vue'),
    meta: { title: 'Đăng nhập' },
  },
  {
    path: '/signup',
    name: 'signup-page',
    component: () => import('../pages/login/signup.vue'),
    meta: { title: 'Đăng ký' },
  },

  {
    path: '/account',
    name: 'account-manager-page',
    component: () => import('../layouts/account-manager.vue'),
    meta: { title: 'Quản lý' },
    redirect: '/account/overview',
    children: [
      {
        path: 'overview',
        name: 'account-manager-overview',
        component: () => import('../pages/account-manager/overview.vue'),
        meta: { title: 'Quản lý' },
      },
      // Profile
      {
        path: 'profile/edit-user-info',
        name: 'account-manager-edit-user-info',
        component: () => import('../pages/account-manager/profile/edit-user-info.vue'),
        meta: { title: 'Chỉnh sửa hồ sơ' },
      },
      {
        path: 'profile/change-user-password',
        name: 'account-manager-change-user-password',
        component: () => import('../pages/account-manager/profile/change-user-password.vue'),
        meta: { title: 'Đổi mật khẩu của bạn' },
      },
      // Organization
      {
        path: 'organization/departments',
        name: 'account-manager-departments',
        component: () => import('../pages/account-manager/organization/departments.vue'),
        meta: { title: 'Phòng ban' },
      },
      {
        path: 'organization/departments/create',
        name: 'account-manager-department-create',
        component: () => import('../pages/account-manager/organization/create-department.vue'),
        meta: { title: 'Tạo phòng ban' },
      },
      {
        path: 'organization/departments/:departmentId',
        name: 'account-manager-department-detail',
        component: () => import('../pages/account-manager/organization/department-detail.vue'),
        meta: { title: 'Phòng ban' },
        children: [],
      },
      {
        path: 'organization/departments/:departmentId/add-users',
        name: 'account-manager-department-detail-add-users',
        component: () => import('../pages/account-manager/organization/add-users-to-department.vue'),
        meta: { title: 'Thêm thành viên' },
      },
      {
        path: 'organization/departments/:departmentId/add-policies',
        name: 'account-manager-department-detail-add-policies',
        component: () => import('../pages/account-manager/organization/add-policies-to-department.vue'),
        meta: { title: 'Thêm quyền hạn' },
      },
    ],
  },
  {
    path: '/:catchAll(.*)', // Unrecognized path automatically matches 404
    redirect: '/404',
  },
  {
    path: '/404',
    name: 'page-not-found',
    component: () => import('../pages/error/404.vue'),
    meta: { title: '404 Not Found' },
  },
];

export default home;
