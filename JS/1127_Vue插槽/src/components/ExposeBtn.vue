<template>
  <input type="button" :value="count" @click="count++" />
</template>

<script>
import { ref } from 'vue'
const count = ref(0)
const func = () => {
  alert(count.value)
}

// defineExpose 是特殊語法，不需要import
//定義那些變數或函式可以讓外部直接存取
// 只有script setup需要寫，script + export default不需要
defineExpose({
  count,
  func,
})
</script>
