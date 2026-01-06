<template>
  <!-- v-app 是vuetify最外層的元件，可以套用到主題的設定 -->
  <v-app>
    <v-app-bar>
      <v-app-bar-title>網站標題</v-app-bar-title>
      <v-btn prepend-icon="mdi-home" to="/">首頁</v-btn>
      <v-btn prepend-icon="mdi-cog" to="/test">測試頁</v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
//
</script>
