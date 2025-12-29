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
  <!-- 元件有很多插槽時，標籤內的內容(ABC)會蓋掉沒有名字的預設插槽(card-body內的插槽)的預設內容 -->
  <SlotCardTwo>ABCD</SlotCardTwo>
  <!--
  沒有template標籤會用預設插槽
  或是設定template內的插槽名稱為default也可以使用預設插槽: 
  <template #default>789</template>
  -->
  <SlotCardTwo>
    <!-- 
    要使用有名字的插槽，需使用template語法:
    <template v-slot:插槽名稱>插槽內容</template>
    或是簡寫:
    <template #插槽名稱>插槽內容</template>

    沒有template標籤的內容則會用預設插槽
    或是設定template內的插槽名稱為default也可以使用預設插槽: 
    <template #default>1234</template>
    -->
    1234
    <template v-slot:title>5678</template>
    <template #footer>xyz</template>
  </SlotCardTwo>
  <hr />
  <SlotCardThree>
    <!-- 
    使用插槽提供的資料的語法，必須在元件標籤內包一個<template>
    語法:<template #default="自訂插槽提供的資料名稱"></template>
    -->
    <!-- 在此data變數代表插槽提供的資料，且data只能在template內使用 -->
    <template #default="data">
      <p>{{ data.text }}</p>
      <!-- 插槽內也能使用自己的資料 -->
      <p>{{ num }}</p>
      <input type="button" value="+b" @click="data.func" />
    </template>
  </SlotCardThree>
  <hr />
  <h1 ref="title">AAA</h1>
  <h2 ref="subtitle">BBB</h2>
  <ExposeBtn ref=""></ExposeBtn>
</template>

<style scoped></style>

<script setup>
import { ref,onMounted,useTemplateRef } from 'vue'
import SlotCard from './components/SlotCard.vue'
import SlotCardTwo from './components/SlotCardTwo.vue'
import SlotCardThree from './components/SlotCardThree.vue'
import ExposeBtn from './components/ExposeBtn.vue'

const num = ref(100)

// vue3.4以前
// 設定與標籤的 ref 同名的變數，預設值是null
// 這個變數會在 mounted 時機點後代表標籤
const title=ref(null)
onMounted(()=>{
  console.log(title.value.innerText)
})

// vue3.5以後
// const 自訂變數名 = useTemplateRef(ref名)
// 這個變數會在 mounted 時機點後代表標籤
const subtitle = useTemplateRef('subtitle')
onMounted(()=>{
  console.log(subtitle.value.innerText)
  console.log(title.value.innerText)
})
</script>
