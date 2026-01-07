// Plugins
import { fileURLToPath, URL } from 'node:url'
import Vue from '@vitejs/plugin-vue'
import Fonts from 'unplugin-fonts/vite'

import { defineConfig } from 'vite'
// Utilities
import checker from 'vite-plugin-checker'
import vueDevTools from 'vite-plugin-vue-devtools'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    vueDevTools(),
    Fonts({
      google: {
        families: [
          {
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900',
          },
        ],
      },
    }),
    checker(),
    // 利用 vitePWA 套件讓網站變成PWA。PWA的必要條件:1. https 2. 要有servive worker 3. 要有app設定檔和至少兩個icon，用vitePWA可以幫我們生成這些。
    VitePWA({
      // 設定 npm run dev也能測試PWA
      devOptions: {
        enabled: true,
      },
      // 自動更新快取
      registerType: 'autoupdate',
      // 使用workbox 套件產生網站檔案快取的 service worker
      // 調整 workbox 的設定
      workbox: {
        // 清除過期的快取
        cleanupOutdatedCaches: true,
        // 要快取那些檔案? 設定成所有資料夾的所有檔案
        globPatterns: ['**/*'],
        /* 是否要忽略網址參數?
        這兩個路徑網址參數不同，會被當成不同檔案
          a.jpg?fbclid=123
          a.jpg?fbclid=456
        修改設定成忽略所有網址參數，就會被當成相同檔案
        */
        ignoreURLParametersMatching: [/.*/],
      },
      // Android 的 PWA 設定
      // 自動產生 site.webmainfest檔
      manifest: {
        name: 'Pomodoro', // 網站名稱
        short_name: 'Pomodoro', // 小圖示的名稱
        icons: [
          // 用到的icon
          {
            src: '/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        theme_color: '#ff6e80', // 主色:icon的背景色
        background_color: '#ff6e80', // background_color:開啟畫面的背景色
        display: 'standalone', // PWA該怎麼顯示?預設式standalone，讓應用程式具有獨立應用程式的類似外觀和操作體驗(假app)，會在自己的視窗中執行而與瀏覽器分開，隱藏一些瀏覽器常有的UI元素，例如:網址列，讓自己看起來像獨立App。
        // https://web.dev/articles/add-manifest?hl=zh-tw#display
        // 開始網址
        start_url: '/',
        // 應用程式的範圍
        scope: '/',
      },
    }),
  ],
  optimizeDeps: {
    exclude: [
      'vuetify',
      'vue-router',
      'unplugin-vue-router/runtime',
      'unplugin-vue-router/data-loaders',
      'unplugin-vue-router/data-loaders/basic',
    ],
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  server: {
    port: 3000,
  },
})
