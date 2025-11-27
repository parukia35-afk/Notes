<template lang="pug">
#footer
  p 網頁設計及維護：00、最近更新日期：{{ date }}
</template>

<script setup>
const date = new Date().toLocaleDateString()
</script>

<style scoped lang="sass">
#footer
  text-align: center
</style>
