<template>
  <!-- 在Html取得路由資訊的方法 -->
  <h1>金門</h1>
  <p>{{ $route.name }}</p>
  <p>{{ $route.path }}</p>
  <p>{{ $route.meta.title }}</p>
  <input type="button" value="顯示路由資訊" @click="show" />
</template>

<script setup>
// 在JS中取得路由資訊的方法，先引入useRoute()再使用useRoute()
import { useRoute } from 'vue-router'

const route = useRoute()

const show = () => {
  alert(route.meta.title)
}
</script>
