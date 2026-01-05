<template>
  <!-- 如何跳頁:1.用<router-link>標籤跳頁 2.用JS的router.push跳頁 -->
  <h1>首頁</h1>
  <!-- 不能使用 a 標籤，網頁會重新整理=>這不是單頁應用程式應該呈現的效果 -->
  <a href="/jinmen">金門</a>
  <br />
  <!-- (X)<a href="/mazu">馬祖</a> (✔)要用專屬的router-link -->

  <!-- 路徑的三種寫法 -->
   <!-- 1. 路徑寫法 -->
  <router-link to="/penghu">澎湖(作業_ToDoList答案)</router-link>
  <br />
  <!-- 2. path 寫法 -->
  <router-link :to="{ path: '/mazu' }">馬祖</router-link>
  <br />
  <!-- 3. name 寫法 -->
  <router-link :to="{ name: 'jinmen' }">金門</router-link>
</template>
