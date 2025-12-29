<template>
  <div class="card">
    <!-- slot 就是插槽，slot標籤內的東西是顯示預設內容 -->
    <slot>卡片內容</slot>
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
