import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

// 路由有兩種模式:createWebHistory 和 createWebHashHistory
/* 
  前者的分頁路徑名稱會是locakhost:5173/jinmen，但實際上我們並沒有jinmen.html這個檔案，必須額外設定將所有請求導到index.html裡面
  後者的分頁路徑名稱是locakhost:5173/#/jimen，#在html代表id
*/
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  // 定義我的網站有哪些頁面可以用
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
      // 這裡的meta跟Html的<meta>不太一樣，這裡的代表這個路由的一些資訊(meta不一定要寫，但上面的path,name,component通常一定會有)
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
        title: '卡蹓到馬祖',
      },
    },
    {
      path: '/penghu',
      name: 'penghu',
      // 需要時才會載入，打包時會產生單獨的js檔
      component: () => import('@/views/PenghuView.vue'),
      meta: {
        title: '踏浪澎湖行',
        // meta不一定要寫。裡面的資訊也是可以自訂的，例如:apple
        apple: '^_^',
      },
    },
  ],
})
// 導航守衛:可以寫在全局或單獨一個路由獨享的或元件內
// 進到每頁之前執行一個function
// to = 要去哪裡
// from = 從哪裡來
router.afterEach((to, from) => {
  document.title = to.meta.title //頁面的title變成我要去的頁面的meta的title=>換頁後瀏覽器頁籤的標題就變了
})
// 進到每頁之後執行一個function，
// 例如:需要使用者登入的網頁不應該讓未登入者進度帳號管理頁面，就可以用beforeEach()把人攔下來
// router.beforeEach()

export default router
