<template lang="pug">
#left
  table
    template(v-for="(link, idx) in links" :key="idx")
      tr
        td
          img(:src="link.image" @click="go(link.page)")
      tr(v-if="idx !== links.length - 1")
  p
    a 檔案下載
</template>

<script setup>
const links = [
  { page: 'yangmingshan', image: new URL('@/assets/park0302.jpg', import.meta.url).href },
  { page: '', image: new URL('@/assets/park0303.jpg', import.meta.url).href },
  { page: '', image: new URL('@/assets/park0304.jpg', import.meta.url).href },
  { page: '', image: new URL('@/assets/park0305.jpg', import.meta.url).href },
]

const emit = defineEmits(['go'])
const go = (page) => {
  emit('go', page)
}
</script>

<style scoped lang="sass">
#left
  width: 200px
  height: calc( 768px - 65px - 20px )
  background: #0fc
  margin-left: 12px
  float: left
  text-align: center
table
  width: 100%
tr:nth-child(even)
  height: 20px
img
  width:  120px
  height: 40px
</style>
