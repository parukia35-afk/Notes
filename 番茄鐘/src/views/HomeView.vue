<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">目前事項</h1>
      </v-col>
      <v-divider />
      <v-col class="text-center" cols="12">
        <!--
        對timeleftText(本質是個函數return值出來的變數，值是00:00這樣樣式的字串)跑迴圈。<字串可以跑迴圈!?可以!會當作字串組成的陣列>
        data和idx是v-for迴圈自動產生的臨時變數，名稱可自取但順序不能錯!
        data:目前迴圈到的那個東西(他的型別可以是任何東西，此例是字串)
        idx:目前迴圈到的東西的索引
        -->
        <DigitNumber
          v-for="(data, idx) in timeleftText"
          :key="idx"
          color="turquoise"
          :data="data"
        ></DigitNumber>
        <!--
          <p>{{ time.timeleft }}</p>
          <p>{{ timeleftText }}</p>
        -->
        <h2>{{ list.currentItem || '沒有事項' }}</h2>
        <!--
          開始按鈕的停用條件
          1. 倒數中
          2. 目前沒有事項也沒有未完成事項
        -->
        <v-btn
          :disabled="
            status === STATUS.COUNTING || (list.currentItem.length === 0 && list.items.length === 0)
          "
          icon="mdi-play"
          @click="startTimer"
        />
        <!-- 只有倒數中才能暫停 -->
        <v-btn :disabled="status !== STATUS.COUNTING" icon="mdi-pause" @click="pause" />
        <!-- 目前有事項才能跳過 -->
        <v-btn :disabled="list.currentItem.length === 0" icon="mdi-skip-next" @click="finish" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useWebNotification } from '@vueuse/core'
import DigitNumber from '@/components/DigitNumber.vue'
import { useListStore } from '@/stores/list'
import { useSettingsStore } from '@/stores/settings'
import { useTimeStore } from '@/stores/time'

/*
  onMounted是元件被掛載的時候；onUnmounted是元件被卸載的時候。
  onMounted(() => {
    console.log('mounted')
  })
  onUnmounted(() => {
    console.log('unmounted')
  })
  現在，切換分頁的時候，本來在計時的元件會被銷毀，但計時器不會自動停止。而重新切回Home頁面時，又會被重新掛載一個新的元件。
  */
const list = useListStore()
const settings = useSettingsStore()
const time = useTimeStore()

// 將剩餘秒數轉成幾分幾秒(00:00)的顯示方式
const timeleftText = computed(() => {
  const m = Math.floor(time.timeleft / 60)
    .toString()
    .padStart(2, '0')
  const s = (time.timeleft % 60).toString().padStart(2, '0')
  return m + ':' + s
})
// 到數計時的狀態有三種:停止、倒數中、暫停
const STATUS = {
  STOP: 0,
  COUNTING: 1,
  PAUSE: 2,
}
// 此變數用來記錄目前的倒數狀態是哪一種(看值是0或1或2)
const status = ref(STATUS.STOP)

let timer = 0

// 點擊 mid-play按鈕執行此函式
const startTimer = () => {
  if (status.value === STATUS.STOP && list.items.length > 0 && list.currentItem === '') {
    // 如果是停止狀態下開始，而且有待辦事項
    list.currentItem = time.isBreakTime ? '休息' : list.items.shift().text // 就從待辦事項裡取出第一個，放入目前事項
    /* 換句話說，如果狀態是暫停(不符合if條件)，就不會再把待辦事項拉到目前事項 */
  }

  status.value = STATUS.COUNTING // 然後把狀態改為倒數中

  timer = setInterval(() => {
    time.timeleft-- // 每秒time(time.js)的timeleft變數--

    if (time.timeleft < 0) {
      // 如果剩餘時間小於0，執行function finish
      finish()
    }
  }, 1000)
}
// 結束計時function，當自然倒數計時歸零或按下跳過鈕時觸發
const finish = () => {
  clearInterval(timer) // 停止計時

  status.value = STATUS.STOP // 將狀態改為停止

  const audio = new Audio() // 播音樂的方法:先建立一個audio物件給個變數
  audio.src = settings.selectedAlarm.file // 設定其來源是settings.js中選到的鬧鐘(物件)的file(key)的值
  audio.play() // 然後寫這行就可以播了

  // 當事項完成時推播通知
  const { show, isSupported, permissionGranted } = useWebNotification({
    title: '事項完成',
    body: list.currentItem,
    icon: new URL('@/assets/pomodoro-technique.png', import.meta.url).href,
  })
  if (isSupported.value && permissionGranted.value) {
    show()
  }

  if (!time.isBreakTime) {
    list.finishedItems.push({
      // 在finishedItems(陣列)push一個物件，其id(key)為id(list.js中的變數)的值，後將id++；text(key)的值為currentItem
      id: list.id++,
      text: list.currentItem,
    })
  }

  list.currentItem = '' // 然後將currentItem(變數)改為空值

  // 倒數結束後，如果還有待辦事項，則將isBreakTime的值倒過來
  if (list.items.length > 0) {
    time.isBreakTime = !time.isBreakTime // 將判斷是否休息時間的值倒過來
  }

  time.timeleft = time.isBreakTime ? time.TIME_BREAK : time.TIME // 將剩餘時間重置。如果是休息時間則將剩餘時間改成TIME_BREAK的值，否則改為TIME的值。

  // 如果倒數結束後，待辦清單還有東西則再次開始倒數
  if (list.items.length > 0) {
    startTimer() // 繼續下一輪，這樣就會以一組「待辦事項+休息」不斷循環，不須重新按下開始
  }
}
// 暫停計時function
const pause = () => {
  clearInterval(timer) // 停止計時
  status.value = STATUS.PAUSE // 將狀態改為暫停
}
</script>
