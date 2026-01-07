<template>
  <v-container class="h-100">
    <v-row align="center" class="h-100" justify="center">
      <v-col class="text-center" cols="12">
        <v-icon size="40">mdi-cog</v-icon>
        <h1>請選擇管理項目</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<route lang="yaml">
meta:
  layout: admin
  title: '管理首頁'
  login: login-only
  admin: true
</route>
