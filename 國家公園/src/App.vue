<template lang="pug">
  TopHeader
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
