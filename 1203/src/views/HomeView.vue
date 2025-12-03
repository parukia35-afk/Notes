<template>
  <h1>首頁</h1>
  <!-- 不能使用 a 標籤，網頁會重新整理 -->
  <!-- (X)<a href="/mazu">馬祖</a> (✔)要用專屬的router-link -->
  <router-link to="/mazu">馬祖</router-link>
  <br />
  <router-link :to="{ path: '/mazu' }">馬祖</router-link>
  <br />
  <router-link :to="{ name: 'jinmen' }">金門</router-link>
</template>
