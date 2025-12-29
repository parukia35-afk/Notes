<template>
  <div class="card">
    <div class="card-title">
      <slot name="title">預設Title</slot>
    </div>
    <div class="card-body">
      <!-- 
      一般標籤如<img>，其屬性是瀏覽器定義好的，你只能遵守它的規則寫src,alt等
      <slot>標籤則是自己身為元件開發者定義的，其屬性命名、有哪些屬性是可以自己定義的。
      在這例子中，讓slot的text屬性綁定 text變數，func屬性綁定 func函式

      這是做作用域插槽(Scoped Slots)的用法，由子元件提供其內部資料，遞給外部使用。外部具有權力決定是否使用這些資料。
      -->
      <slot :text="text" :func="func">預設Body</slot>
    </div>
    <div class="card-footer">
      <slot name="footer">預設Footer</slot>
    </div>
  </div>
</template>

<style>
.card {
  width: 100px;
  border: 1px solid black;
  display: inline-block;
  margin: 2px;
}
</style>

<script setup>
import { ref } from 'vue'
const text = ref('aaa')
const func = () => {
  text.value += 'b'
}
</script>
