<template lang="pug">
  #top
    //- 引用 assets 的檔案使用相對路徑
    //- 打包的時候會在檔名加上序號，避免快取
    img(src='@/assets/park0307.gif')
    //- 引用 public 檔案以 / 開頭
    //- 打包的時候是單純的複製貼上，檔名不會加上序號，故檔名會與打包前相同
    //- 所以假設如果圖片A被換成圖片B，但檔名都還是取一樣，瀏覽器快取就會讀到舊友的A的圖片!!
    //- img(src='/park0307.gif')
</template>

<style scoped lang="sass">
#top
  width: 1000px
  background: blue
  margin: auto
  text-align: center
</style>
