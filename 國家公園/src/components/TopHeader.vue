<template lang="pug">
  #top
    //- 引用 assets 的檔案使用相對路徑
    //- 打包的時候會在檔名加上序號，避免快取
    img(src='@/assets/park0307.gif')
    //- 引用 public 檔案以 / 開頭
    //- 打包的時候是單純的複製貼上
    //- img(src='/park0307.gif')
</template>

<style scoped lang="sass">
#top
  width: 1000px
  background: blue
  margin: auto
  text-align: center
</style>
