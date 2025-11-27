<template>
  <div class="card">
    <div class="card-title">
      <!-- 有名字的插槽可以有好幾個 -->
      <slot name="title">預設Title</slot>
    </div>
    <div class="card-body">
      <!-- 預設插槽(沒有名字的)只能有一個 -->
      <slot>預設Body</slot>
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
