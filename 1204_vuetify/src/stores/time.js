import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTimeStore = defineStore('time', () => {
  const timeleft = ref()
  const isBreakTime = ref(false)

  const TIME = import.meta.env.VITE_TIME
  const TIME_BREAK = import.meta.env.VITE_TIME_BREAK

  return {
    timeleft,
    isBreakTime,
    TIME,
    TIME_BREAK,
  }
})
