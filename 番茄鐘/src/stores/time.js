import { defineStore } from 'pinia'
import { ref } from 'vue'

// 環境變數
// parseInt的第二個參數10代表使用十進位，是個好習慣
const TIME = import.meta.env.VITE_TIME
const TIME_BREAK = import.meta.env.VITE_TIME_BREAK

export const useTimeStore = defineStore('time', () => {
  const timeleft = ref(TIME) // 時間還剩多久?
  const isBreakTime = ref(false) // 現在是否是休息時間?

  return {
    timeleft,
    isBreakTime,
    TIME,
    TIME_BREAK,
  }
})
/* 環境設定檔 .env
  https://cn.vite.dev/guide/env-and-mode#env-variables-and-modes
  .env                # 所有情况下都会加载
  .env.local          # 所有情况下都会加载，但会被 git 忽略  --->因.gitignore中有設定只要是.env.local都會被git省略
  .env.[mode]         # 只在指定模式下加载                  --->mode是模式，有兩種:開發模式與正式模式。
  .env.[mode].local   # 只在指定模式下加载，但会被 git 忽略

  NODE_ENV 和 模式
  https://cn.vite.dev/guide/env-and-mode#env-variables-and-modes #NODE_ENV 和 模式
  */
