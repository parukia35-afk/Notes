import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  /* base預設是'/'，指的是根目錄，定義打包出來的資源要去哪裡找。
  老師的話:一律改成'./'(相對路徑)
  */
  base: './',
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
/* vite 是打包工具，將vue專案打包成瀏覽器可以直接讀取的樣子 
本來要在瀏覽器開vue專案都要在npm run dev，有了vite打包後就可以直接在瀏覽器打開index.html
打包後會多一個 dist 的資料夾，直接打開index.html即可，但可能因路徑問題或缺少伺服器環境而無法運作
此時便可執行指令 npm run preview

或 npm run preview，它會啟動一個本地伺服器

這些指令是被定義在package.json裡的
*/
