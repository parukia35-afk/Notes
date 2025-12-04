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
              </td>
              <td>
                <v-radio-group v-model="settings.selected" hide-details>
                  <v-radio :value="alarm.id" />
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
  import { useSettingsStore } from '@/stores/settings'

  const settings = useSettingsStore()
</script>
