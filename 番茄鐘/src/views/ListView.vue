<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">未完成</h1>
      </v-col>
      <v-divider />
      <v-col cols="12">
        <!--
        clearable:有個 X鈕 可以清掉輸入框的文字
        label:輸入框的標題
        hint:顯示錯誤訊息
        rules:該元件自帶的對輸入內容的驗證功能
        @keydown.enter:當按下Enter鍵，執行onInputSubmit這個函式
        @click:append:當點擊輸入框旁邊的append-icon時，執行onInputSubmit這個函式
        @update:foucus:當v-text-field被聚焦或模糊的時候會觸發，並給一個布林值
        -->
        <!--
        ref:expose語法
        v-text-field裡有內建一些expose的資料
        https://next.vuetifyjs.com/en/api/v-text-field/#exposed
        -->
        <v-text-field
          ref="inputTextField"
          v-model="input"
          append-icon="mdi-plus"
          clearable
          hint="三個字以上才能新增"
          label="新增事項"
          :rules="[rules.required, rules.length]"
          @click:append="onInputSubmit"
          @keydown.enter="onInputSubmit"
          @update:focused="onInputFocusUpdate"
        />
      </v-col>
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th>事項</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <!-- 將items(待辦事項們)用迴圈印出來 -->
            <tr v-for="(item, idx) in list.items" :key="item.id">
              <td>
                <!-- v-show:若是編輯狀態，則顯示輸入框；跟v-if的差別在於 -->
                <v-text-field
                  v-show="item.edit"
                  ref="editTextField"
                  v-model="item.input"
                  autofocus
                  :rules="[rules.required, rules.length]"
                  @keydown.enter="submitEditItem(item, idx)"
                />
                <!-- 非編輯狀態則顯示純文字 -->
                <template v-if="!item.edit">{{ item.text }}</template>
              </td>
              <td>
                <template v-if="item.edit">
                  <!-- 如果事項是在編輯狀態，則icon顯示mid-undo跟check -->
                  <v-btn icon="mdi-undo" @click="cancelEditItem(item)" />
                  <v-btn icon="mdi-check" @click="submitEditItem(item, idx)" />
                </template>
                <!-- 如果事項處於非編輯狀態，則icon顯示mid-pencil跟delete -->
                <template v-else>
                  <v-btn icon="mdi-pencil" @click="editItem(item)" />
                  <v-btn icon="mdi-delete" @click="delItem(item.id)" />
                </template>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col cols="12">
        <h1 class="text-center">已完成</h1>
      </v-col>
      <v-divider />
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th>事項</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in list.finishedItems" :key="item.id">
              <td>{{ item.text }}</td>
              <td>
                <v-btn icon="mdi-delete" @click="delFinishedItem(item.id)"></v-btn>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { nextTick, ref, useTemplateRef } from 'vue'
import { useListStore } from '@/stores/list'

const list = useListStore()

const input = ref('')
const inputTextField = useTemplateRef('inputTextField') // expose語法，取到ref值為inputTextField的元件。就可以寫inputTextField.value.??來存取元件裡的資料或呼叫元件內的function
const editTextField = useTemplateRef('editTextField') // expose語法，取到ref值為editTextField的v-text-field，代表的是進入編輯狀態的輸入框。

// 建立輸入框驗證規則
const rules = {
  required: value => Boolean(value) || '必填欄位',
  length: value => value.length >= 3 || '必須要三個字以上',
}

const onInputSubmit = () => {
  // 先判斷是否驗證成功，如果沒有判斷，則使用者即使輸入內容沒填或不滿3個字也可以過
  if (!inputTextField.value.isValid) return // 如果沒過就return(不執行)
  list.items.push({
    // 在pinia共享的資料(list)內的items(陣列)push一個物件
    id: list.id++, // 其id是共享資料list的id(變數，最初是1)，之後id++
    // text(key)表示尚未編輯前的內容
    text: input.value, // text是input(輸入框內的內容；它被綁定到 input 這個變數上)的值
    edit: false, // 編輯狀態為false
    // input(key)在剛新增時其值跟text(key)是相同的，但在編輯狀態下，input(key)的值會再度與開啟編輯模式的輸入框的內容綁定
    input: input.value, // input(要push的該物件的key)是input(輸入框內容)的值
  })
  inputTextField.value.reset() // reset()是v-text-field中 expose出來的一個函式供我們調用，用來將輸入框清空。
}

/* 當輸入框已清空，點擊輸入框外面時會觸發驗證不通過的紅字，為了消除這bug */
const onInputFocusUpdate = async value => {
  if (!value && !input.value) {
    // 當update:focus帶出的布林值為false且樹入框內無內容時
    await nextTick() // 等待瀏覽器下一次渲染完之後，重置輸入框的驗證狀態
    inputTextField.value.resetValidation()
  }
}
// 當點擊mid-pencil時觸發此函式，將編輯狀態改為true
const editItem = item => {
  item.edit = true
}
// 當點擊mid-check時觸發此函式，將該待辦事項的text(key)的值改成其input(key)的值，而input(key)的值又與輸入框內容綁定。然後再將編輯狀態改為false。
const submitEditItem = (item, idx) => {
  if (!editTextField.value[idx].isValid) return // 當editTextField的第[索引]個不符合驗證時，return
  item.text = item.input
  item.edit = false
}
// 當點擊mid-undo時觸發此函式，將該代辦事項的input(key)的值變成原本的文字(存在text(key)的值)。然後再將編輯狀態改為false。
const cancelEditItem = item => {
  item.input = item.text
  item.edit = false
}

// 當點擊mid-delete時觸發此函式
const delItem = id => {
  // 參數 id代表迴圈到的該待辦事項的id(key)的值
  const idx = list.items.findIndex(item => item.id === id) // 將items(陣列)迴圈一遍尋找第一個其 id(key，被找者)符合觸發此函式的待辦事項的id(key，目標)的值。
  list.items.splice(idx, 1) // 將items(陣列)從找到的索引值開始(包含起點自己)刪除一個
}

// 刪除已完成事項，原理跟待辦事項的刪除一樣，但兩者的 id 是獨立的
const delFinishedItem = id => {
  const idx = list.finishedItems.findIndex(item => item.id === id)
  list.finishedItems.splice(idx, 1)
}
</script>
