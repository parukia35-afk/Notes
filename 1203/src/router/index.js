import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // 一進網站就會載入這個頁面
      component: HomeView,
      meta: {
        title: '首頁',
      },
    },
    {
      path: '/jinmen',
      name: 'jinmen',
      // 需要時才會載入，打包時會產生單獨的js檔
      component: () => import('@/views/JinmenView.vue'),
      meta: {
        title: '金門逍遙遊',
      },
    },
    {
      path: '/mazu',
      name: 'mazu',
      // 需要時才會載入，打包時會產生單獨的js檔
      component: () => import('@/views/MazuView.vue'),
      meta: {
        title: '卡溜到馬祖',
      },
    },
    {
      path: '/penghu',
      name: 'penghu',
      // 需要時才會載入，打包時會產生單獨的js檔
      component: () => import('@/views/PenghuView.vue'),
      meta: {
        title: '踏浪澎湖行',
      },
    },
  ],
})
// to = 要去哪裡
// from = 從哪裡來
router.afterEach((to, from) => {
  document.title = to.meta.title
})
// router.beforeEach()

export default router
