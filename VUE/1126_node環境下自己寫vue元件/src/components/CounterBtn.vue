<template>
  <input type="button" :value="num" @click="num++" />
</template>

<!-- 在script加上setup，不需要return，因其會自動判斷 -->
<script setup>
import { ref } from 'vue'
const num = ref(0)
</script>

<!--選項式API寫法
<script>
export default {
  data() {
    return {
      num: 0,
    }
  },
}
</script>
-->

<!--組合式API寫法
<script>
import { ref } from 'vue'

export default {
  setup() {
    const num = ref(0)
    return {
      num,
    }
  },
}
</script>
-->
