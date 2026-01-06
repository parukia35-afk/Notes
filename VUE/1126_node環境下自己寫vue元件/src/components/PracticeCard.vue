<template>
    <div class="card">
        <img :src="image">
        <input type="button" :value="good" @click="toggle" :class="{isGood:thumb}">
        <p>{{ text }}</p>
    </div>
</template>

<script setup>
    import { ref,computed } from 'vue';

    const props=defineProps(['image','text'])
    const emitt=defineEmits(['toggle'])

    // 定義一個變數 thumb 用來記錄現在按讚的狀態
    const thumb=ref(false)

    // 函式 good 會根據變數 thumb 的布林值，return收回讚或讚
    const good=computed(()=>{
        return thumb.value?'收回讚':'讚'
    })
    
    // 當按下按鈕觸發函式 toggle，將變數 thumb 的值取反
    const toggle=()=>{
        thumb.value=!thumb.value
        emitt('toggle',thumb.value)
    }
</script>

<style scoped>
    .card{
        width:200px;
        border:1px solid black;
        display:inline-block;
        margin-right: 50px;
        text-align: center;
    }
    img{
        width:100%;
    }
    
    .isGood{
        background-color: #ff4757;
        color: white;
    }
</style>