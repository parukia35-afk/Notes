// Utilities
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const number = ref(0)

  const plus = () => {
    number.value++
  }

  const minus = () => {
    number.value--
  }

  const double = computed(() => {
    return number.value * 2
  })

  return {
    number,
    plus,
    minus,
    double,
  }
})

/*
export const useAppStore = defineStore('app', {
  // 保存的資料 = data
  state: () => ({
    number: 0,
  }),
  // 修改資料的 function = methods
  actions: {
    plus () {
      this.number++
    },
    minus () {
      this.number--
    },
  },
  // 取資料的 function = computed
  getters: {
    double () {
      return this.number * 2
    },
  },
})
*/
