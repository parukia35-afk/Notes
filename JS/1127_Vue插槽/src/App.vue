<template>
  <!-- 插槽:元件標籤中沒東西，顯示預設內容 -->
  <SlotCard></SlotCard>
  <!-- 元件標籤中有東西，覆蓋插槽位置的內容 -->
  <SlotCard>ABC</SlotCard>
  <SlotCard>
    <h1>AAA</h1>
    <p>BBB</p>
  </SlotCard>
  <hr />
  <!-- 元件有很多插槽時，標籤內的內容會使用預設的插槽 -->
  <SlotCardTwo>ABCD</SlotCardTwo>
  <!--
  沒有template標籤會用預設插槽
  獲次設定template內的插槽名稱為default也可以: 
  <template #default>789</template>
  -->
  <SlotCardTwo>
    <template v-slot:title>5678</template>
    <template #footer>xyz</template>
  </SlotCardTwo>
  <hr />
  <SlotCardThree>
    <!-- 使用插槽提供的資料中的 text 和 func -->
    <template #default="data">
      <p>{{ data.text }}</p>
      <!-- 也能使用自己的資料 -->
      <p>{{ num }}</p>
      <input type="button" value="+b" @click="data.func" />
    </template>
  </SlotCardThree>
  <hr />
  <h1 ref=""></h1>
  <ExposeBtn ref=""></ExposeBtn>
</template>

<style scoped></style>

<script setup>
import { ref } from 'vue'
import SlotCard from './components/SlotCard.vue'
import SlotCardTwo from './components/SlotCardTwo.vue'
import SlotCardThree from './components/SlotCardThree.vue'
import ExposeBtn from './components/ExposeBtn.vue'

const num = ref(100)
</script>
