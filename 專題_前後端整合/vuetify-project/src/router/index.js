/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { useUserStore } from '@/stores/user'
import serviceUser from '@/services/user'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

router.beforeEach(async (to, from, next) => {
  const user = useUserStore()

  // 如果有 token 就取得檢查使用者資料
  if (user.isLoggedIn) {
    try {
      const { data } = await serviceUser.profile()
      user.login(data.result)
    } catch (error) {
      console.log(error)
      user.logout()
    }
  }

  // 根據登入狀態和權限判斷能不能去目標頁面
  if (to.meta.login === 'no-login-only' && user.isLoggedIn) {
    // 去未登入限定頁面，且使用者有登入，回首頁
    next('/')
  } else if (to.meta.login === 'login-only' && !user.isLoggedIn) {
    // 去登入限定頁面，且使用者沒有登入，回登入頁面
    next('/login')
  } else if (to.meta.admin && !user.isAdmin) {
    // 去管理員限定頁面，且使用者不是管理員，回首頁
    next('/')
  } else {
    // 繼續
    next()
  }
})

router.afterEach((to) => {
  document.title = `購物網站 | ${to.meta.title}`
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
