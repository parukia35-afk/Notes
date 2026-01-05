import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useListStore = defineStore('list', () => {
  // 待辦事項
  const items = reactive([])
  // 已完成事項
  const finishedItems = reactive([])
  // 目前進行中事項
  const currentItem = ref('')

  /* 事項流向:使用者在輸入框輸入事項→ 丟進items(待辦事項)→開始進行時丟進currentItem(目前進行中事項)→完成後丟進finishedItems(已完成事項) */
  const id = ref(1)

  return {
    items,
    finishedItems,
    currentItem,
    id,
  }
})
