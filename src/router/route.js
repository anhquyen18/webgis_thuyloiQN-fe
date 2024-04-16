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
    meta: { title: 'Đăng Nhập' },
  },
  {
    path: '/signup',
    name: 'signup-page',
    component: () => import('../pages/login/signup.vue'),
    meta: { title: 'Đăng Ký' },
  },

  {
    path: '/account/overview',
    name: 'account-manager-page',
    component: () => import('../layouts/account-manager.vue'),
    meta: { title: 'Quản Lý' },
  },

  {
    path: '/account/overview',
    name: 'account-manager',
    component: () => import('../layouts/account-manager.vue'),
    meta: { title: 'Tài Khoản' },
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
