<template>
  <input type="button" :value="text" @click="toggle" />
</template>

<script setup>
import { ref, computed } from 'vue'

// defineEmits 定義元件有哪些自訂事件
// defineEmits() 是特殊語法不需要 import 就能用
const emit = defineEmits(['toggle'])

const good = ref(false)

const text = computed(() => {
  return good.value ? '收回讚' : '讚'
})

const toggle = () => {
  good.value = !good.value
  // emit('自訂事件名稱', 傳出的資料)
  emit('toggle',good.value) // 
}
</script>
