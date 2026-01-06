<template>
    <input type="button" value="語法" @click="tab='lecture'">
    <input type="button" value="練習" @click="tab='practice'">
    <hr>
    <LectureLecture v-if="tab=='lecture'"/>
    <PracticePractice v-else/>
</template>

<script setup>
    import { ref } from 'vue';
    import LectureLecture from './LectureLecture.vue';
    import PracticePractice from './PracticePractice.vue';

    const tab=ref('lecture')
</script>