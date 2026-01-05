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
            <tr v-for="(item, idx) in list.items" :key="item.id">
              <td>
                <v-text-field
                  v-show="item.edit"
                  ref="editTextField"
                  v-model="item.input"
                  autofocus
                  :rules="[rules.required, rules.length]"
                  @keydown.enter="submitEditItem(item, idx)"
                />
                <template v-if="!item.edit">{{ item.text }}</template>
              </td>
              <td>
                <template v-if="item.edit">
                  <v-btn icon="mdi-undo" @click="cancelEditItem(item)" />
                  <v-btn icon="mdi-check" @click="submitEditItem(item, idx)" />
                </template>
                <template v-else>
                  <v-btn icon="mdi-pencil" @click="editItem(item)" />
                  <v-btn icon="mdi-delete" @click="delItem(item.id)" />
                </template>
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
  const editTextField = useTemplateRef('editTextField')

  // 建立輸入框驗證規則
  const rules = {
    required: value => Boolean(value) || '必填欄位',
    length: value => value.length >= 3 || '必須要三個字以上',
  }

  const onInputSubmit = () => {
    // 先判斷是否驗證成功，如果沒有判斷，則使用者即使輸入內容沒填或不滿3個字也可以過
    if (!inputTextField.value.isValid) return // 如果沒過就return(不執行)
    list.items.push({ // 在pinia共享的資料(list)內的items(陣列)push一個物件
      id: list.id++, // 其id是共享資料list的id(變數，最初是1)，之後id++
      text: input.value, // text是input(輸入框內的內容；它被綁定到 input 這個變數上)的值
      edit: false, // 編輯狀態為false
      input: input.value, // input(要push的該物件的key)是input(輸入框內容)的值
    })
    inputTextField.value.reset() // reset()是v-text-field中 expose出來的一個函式供我們調用，用來將輸入框清空。
  }

  const onInputFocusUpdate = async value => {
    if (!value && !input.value) {
      await nextTick()
      inputTextField.value.resetValidation()
    }
  }

  const editItem = item => {
    item.edit = true
  }

  const submitEditItem = (item, idx) => {
    if (!editTextField.value[idx].isValid) return
    item.text = item.input
    item.edit = false
  }

  const cancelEditItem = item => {
    item.input = item.text
    item.edit = false
  }

  const delItem = id => {
    const idx = list.items.findIndex(item => item.id === id)
    list.items.splice(idx, 1)
  }
</script>
