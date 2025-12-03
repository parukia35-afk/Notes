<template>
  <h1>金門</h1>
  <p>{{ $route.name }}</p>
  <p>{{ $route.path }}</p>
  <p>{{ $route.meta.title }}</p>
  <input type="button" value="顯示路由資訊" @click="show" />
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const show = () => {
  alert(route.meta.title)
}
</script>
