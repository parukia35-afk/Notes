<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const links = reactive([
  {
    blue: new URL('@/assets/0501b.gif', import.meta.url).href,
    red: new URL('@/assets/0501r.gif', import.meta.url).href,
    hover: false,
    path: '/jinmen',
  },
  {
    blue: new URL('@/assets/0502b.gif', import.meta.url).href,
    red: new URL('@/assets/0502r.gif', import.meta.url).href,
    hover: false,
    path: '/mazu',
  },
  {
    blue: new URL('@/assets/0503b.gif', import.meta.url).href,
    red: new URL('@/assets/0503r.gif', import.meta.url).href,
    hover: false,
    path: '/penghu',
  },
  {
    blue: new URL('@/assets/0506b.gif', import.meta.url).href,
    red: new URL('@/assets/0506r.gif', import.meta.url).href,
    hover: false,
    path: '/',
  },
])

const go = (path) => {
  router.push(path)
}
</script>

<template>
  <div id="left">
    <table>
      <tr>
        <!-- $router.push 跳頁 -->
        <td><img src="@/assets/0508.gif" @click="$router.push({ name: 'home' })" /></td>
      </tr>
      <tr>
        <td>
          <img src="@/assets/0507.jpg " @click="$router.push('/')" />
        </td>
      </tr>
      <tr v-for="(link, idx) in links" :key="idx">
        <td>
          <img
            :src="link.hover ? link.red : link.blue"
            @mouseenter="link.hover = true"
            @mouseleave="link.hover = false"
            @click="go(link.path)"
          />
        </td>
      </tr>
    </table>
  </div>
  <div id="right">
    <marquee>歡迎來到書曼的旅遊相簿，本網站有我的旅遊影像紀錄介紹耶！</marquee>
    <!-- 路由對應的元件顯示位置 -->
    <router-view></router-view>
  </div>
</template>

<style>
#app {
  width: 1024px;
  height: 768px;
  margin: auto;
  background: #ffc;
}

body {
  background: #333;
}
</style>

<style scoped>
#left {
  width: 150px;
  height: 100%;
  float: left;
}

#right {
  width: calc(1024px - 150px);
  height: 100%;
  float: left;
}

marquee {
  height: 50px;
  font-size: 24px;
  font-family: '標楷體';
  color: red;
  line-height: 50px;
  font-weight: bold;
}
</style>
