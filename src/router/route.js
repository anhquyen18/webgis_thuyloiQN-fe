const home = [
  {
    path: '/',
    name: 'home-page',
    component: () => import('../layouts/home.vue'),
    meta: { title: 'Home' }
  }
]

export default home
