<template>
    <input type="button" :value="a" @click="a++">
</template>

<script setup>
    // defineModel('資料名稱')
    const a=defineModel('a')
</script>