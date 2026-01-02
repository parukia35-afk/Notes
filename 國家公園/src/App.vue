<template lang="pug">
  TopHeader
  //- top-header  在pug裡，使用元件可以打 首字大寫法 或 小寫法+詞語間以-隔開
  #left
  LeftMenu(@go="changePage")
  #right 
    RightMarquee
    MainPage(v-if="page===''")
    YangMingShan(v-else-if="page==='yangmingshan'")
  BottomFooter
</template>

<style scoped lang="sass">
#right
  width: 800px
  float: right
  margin-right: 12px
  height: calc( 768px - 65px - 20px)
</style>
<!-- 也可以將#app 的style寫在元件裡，但如果style是scoped會吃不到#app的style
 因為#app是有點類似App.vue外層的東西(?)
 在此範例是將style寫在外部開個css資料夾專門存放樣式表，並在main.js引用它
 #app
    width:1024px
    height:768
-->
<script setup>
import TopHeader from '@/components/TopHeader.vue'
import LeftMenu from '@/components/LeftMenu.vue'
import RightMarquee from '@/components/RightMarquee.vue'
import MainPage from '@/pages/MainPage.vue'
import BottomFooter from '@/components/BottomFooter.vue'
import YangMingShan from '@/pages/YangMingShan.vue'
import { ref } from 'vue'

const page = ref('')
const changePage = (value) => {
  page.value = value
}
</script>
