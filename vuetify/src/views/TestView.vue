<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">測試頁</h1>
      </v-col>
      <v-divider />
      <v-col>
        <p>{{ store.number }}</p>
        <p>{{ store.double }}</p>
        <v-btn @click="store.plus">store.+</v-btn>
        <v-btn @click="store.minus">store.-</v-btn>
        <v-btn @click="store.number++">+</v-btn>
        <v-btn @click="store.number++">-</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { useAppStore } from '@/stores/app'
  const store = useAppStore()
</script>
