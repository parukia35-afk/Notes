<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">目前事項</h1>
      </v-col>
      <v-divider />
      <v-col class="text-center" cols="12">
        <DigitNumber v-for="(data, idx) in timeleftText" :key="idx" color="white" :data="data"></DigitNumber>
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
  import { computed, ref } from 'vue'
  import DigitNumber from '@/components/DigitNumber.vue'
  import { useListStore } from '@/stores/list'
  import { useSettingsStore } from '@/stores/settings'
  import { useTimeStore } from '@/stores/time'

  const list = useListStore()
  const settings = useSettingsStore()
  const time = useTimeStore()

  const timeleftText = computed(() => {
    const m = Math.floor(time.timeleft / 60).toString().padStart(2, '0')
    const s = (time.timeleft % 60).toString().padStart(2, '0')
    return m + ':' + s
  })

  const STATUS = {
    STOP: 0,
    COUNTING: 1,
    PAUSE: 2,
  }
  const status = ref(STATUS.STOP)

  let timer = 0

  const startTimer = () => {
    // 如果是停止狀態下開始，而且有待辦事項
    // 從待辦事項裡取出第一個，放入目前事項
    if (status.value === STATUS.STOP && list.items.length > 0 && list.currentItem === '') {
      list.currentItem = list.items.shift().text
    }

    status.value = STATUS.COUNTING

    timer = setInterval(() => {
      time.timeleft--

      if (time.timeleft < 0) {
        finish()
      }
    }, 1000)
  }

  const finish = () => {
    clearInterval(timer)

    status.value = STATUS.STOP

    list.finishedItems.push({
      id: list.id++,
      text: list.currentItem,
    })

    list.currentItem = ''
    time.timeleft = time.TIME
  }

  const pause = () => {
    clearInterval(timer)
    status.value = STATUS.PAUSE
  }
</script>
