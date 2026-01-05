import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // 有哪些時鐘
  const alarms = [
    { id: 1, name: '鬧鐘', file: new URL('@/assets/alarm.mp3', import.meta.url).href },
    { id: 2, name: 'yay', file: new URL('@/assets/yay.mp3', import.meta.url).href },
  ]
  // 記錄使用者使用的時鐘
  const selected = ref(1)

  const selectedAlarm = computed(() => {
    const idx = alarms.findIndex(alarm => alarm.id === selected.value) // .findIndex() 對陣列迴圈提供的function，回傳第一個其結果為true的索引。要注意!!這裡是箭頭函式省略大括號和return的寫法。
    return alarms[idx]
  })

  return {
    alarms,
    selected,
    selectedAlarm,
  }
})
