import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useListStore = defineStore('list', () => {
  // 待辦事項
  const items = reactive([])
  // 已完成事項
  const finishedItems = reactive([])
  // 目前進行中事項
  const currentItem = ref('')

  const id = ref(1)

  return {
    items,
    finishedItems,
    currentItem,
    id,
  }
})
