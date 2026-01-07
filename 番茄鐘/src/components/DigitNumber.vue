<template>
  <!--
  用illustator畫好的"日"存成svg，用vscode開啟會發現圖案由一堆html標籤所構成的。
  每個在illustator裡的路徑的名稱會轉成 path標籤的id
  -->
  <svg
    height="523.213px"
    version="1.1"
    viewBox="0 0 289 523.213"
    width="289px"
    x="0px"
    xml:space="preserve"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    y="0px"
  >
    <!-- 左上豎槓 -->
    <path
      id="B"
      :class="{ active: '045689'.includes(data) }"
      d="M20,249.873c0,5.523-4.477,10-10,10l0,0c-5.523,0-10-4.477-10-10v-218c0-5.523,4.477-10,10-10l0,0c5.523,0,10,4.477,10,10V249.873z"
    />
    <!-- 右上豎槓 -->
    <path
      id="C"
      :class="{ active: '01234789'.includes(data) }"
      d="M289,249.873c0,5.523-4.477,10-10,10l0,0c-5.523,0-10-4.477-10-10v-218c0-5.523,4.477-10,10-10l0,0c5.523,0,10,4.477,10,10V249.873z"
    />
    <!-- 上橫槓 -->
    <path
      id="A"
      :class="{ active: '02356789'.includes(data) }"
      d="M255.082,1.873c5.522,0.048,9.961,4.563,9.914,10.086l0,0c-0.048,5.522-4.563,9.961-10.086,9.914L36.918,20c-5.522-0.048-9.961-4.563-9.914-10.086l0,0C27.052,4.392,31.567-0.047,37.09,0L255.082,1.873z"
    />
    <!-- 中橫槓 -->
    <path
      id="D"
      :class="{ active: '2345689'.includes(data) }"
      d="M255.082,250.81c5.522,0.048,9.961,4.563,9.914,10.086l0,0c-0.048,5.522-4.563,9.961-10.086,9.914l-217.992-1.873c-5.522-0.048-9.961-4.563-9.914-10.086l0,0c0.047-5.522,4.563-9.961,10.085-9.914L255.082,250.81z"
    />
    <!-- 下橫槓 -->
    <path
      id="G"
      :class="{ active: '0235689'.includes(data) }"
      d="M255.082,503.213c5.522,0.048,9.961,4.563,9.914,10.086l0,0c-0.048,5.522-4.563,9.961-10.086,9.914L36.918,521.34c-5.522-0.048-9.961-4.563-9.914-10.086l0,0c0.047-5.522,4.563-9.961,10.085-9.914L255.082,503.213z"
    />
    <!-- 左下豎槓 -->
    <path
      id="E"
      :class="{ active: '0268'.includes(data) }"
      d="M20,498.818c0,5.523-4.477,10-10,10l0,0c-5.523,0-10-4.477-10-10v-218c0-5.523,4.477-10,10-10l0,0c5.523,0,10,4.477,10,10V498.818z"
    />
    <!-- 右下豎槓 -->
    <path
      id="F"
      :class="{ active: '013456789'.includes(data) }"
      d="M289,498.818c0,5.523-4.477,10-10,10l0,0c-5.523,0-10-4.477-10-10v-218c0-5.523,4.477-10,10-10l0,0c5.523,0,10,4.477,10,10V498.818z"
    />
    <!--
    將冒號的部分綁定 class=active的樣式，當active: ture時綁定，false則不綁定。
    '013456789'. includes(data) }表示當傳進的data有這些數字時為true，則class=active的樣式會被綁定。
    -->
    <circle :class="{ active: data === ':' }" cx="146" cy="126.873" r="17" />
    <circle :class="{ active: data === ':' }" cx="146" cy="389.818" r="17" />
  </svg>
</template>

<script setup>
defineProps(['data', 'color'])
</script>

<style scoped>
svg {
  margin: 5px;
  width: 100px;
}
path,
circle {
  /* fill 屬性專用來對 path 和 circle標籤做填滿顏色 */
  fill: black;
  /* 一開始先設定顏色為透明，當active時再套用綁定的顏色，控制不同path的active狀態來實現顯示各種數字的效果 */
}
.active {
  /*
  Vue 與 CSS的綁定
  https://zh-hk.vuejs.org/api/sfc-css-features#v-bind-in-css */
  fill: v-bind(color);
}
</style>
