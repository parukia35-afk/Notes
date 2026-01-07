<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">鈴聲設定</h1>
      </v-col>
      <v-divider />
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th>名稱</th>
              <th>試聽</th>
              <th>選擇</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alarm in settings.alarms" :key="alarm.id">
              <td>{{ alarm.name }}</td>
              <td>
                <audio controls src="alarm.file" />
                <!-- 做出播放器一點都不難，用丙級拿來播音樂的 audio 標籤，加上 controls屬性就好 -->
              </td>
              <td>
                <!--
                沒在v-radio-group加屬性 hide-details之前，單選紐無法置中，是因為開F12會看到底下有一個空白，是預留給表單需要驗證用來顯示錯誤訊息的地方。使用hide-details將其隱藏。
                -->
                <v-radio-group v-model="settings.selected" hide-details>
                  <!-- 使用者在這頁所選的鬧鐘鈴聲種類會與pinia裡的 selected變數相連動 -->
                  <v-radio :value="alarm.id" />
                  <!-- value 代表選擇此單選項時所傳出去的值，等於pinia裡每個alarm的id(1或2)，傳出去是到 v-radio-group，並透過v-model與pinia裡的 selected變數相連動-->
                </v-radio-group>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// 存取pinia中，settings.js的資料
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
</script>
