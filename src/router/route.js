const home = [
  {
    path: '/',
    name: 'home-page',
    component: () => import('../layouts/home.vue'),
    meta: { title: 'Home' },
  },
  {
    path: '/login',
    name: 'login-page',
    component: () => import('../pages/login/login.vue'),
    meta: { title: 'Log in' },
  },
  {
    path: '/signup',
    name: 'signup-page',
    component: () => import('../pages/login/signup.vue'),
    meta: { title: 'Sign up' },
  },
];

export default home;
