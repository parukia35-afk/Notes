<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">未完成</h1>
      </v-col>
      <v-divider />
      <v-col cols="12">
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
  const inputTextField = useTemplateRef('inputTextField')
  const editTextField = useTemplateRef('editTextField')

  const rules = {
    required: value => Boolean(value) || '必填欄位',
    length: value => value.length >= 3 || '必須要三個字以上',
  }

  const onInputSubmit = () => {
    if (!inputTextField.value.isValid) return
    list.items.push({
      id: list.id++,
      text: input.value,
      edit: false,
      input: input.value,
    })
    inputTextField.value.reset()
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
