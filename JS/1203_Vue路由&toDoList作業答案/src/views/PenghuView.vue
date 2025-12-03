<template>
  <form @submit.prevent="addItem">
    <input type="text" placeholder="新增事項" v-model="input" :style="{ border: inputBorder }" />
    <input type="submit" value="新增" />
  </form>
  <hr />
  <img src="" ref="abc" />
  <hr />
  <input type="button" value="全部標記已完成" @click="doneItem(true)" />
  <input type="button" value="全部標記未完成" @click="doneItem(false)" />
  <br />
  <input type="button" value="顯示全部" @click="filter = '全部'" />
  <input type="button" value="顯示已完成" @click="filter = '已完成'" />
  <input type="button" value="顯示未完成" @click="filter = '未完成'" />
  <br />
  <input type="button" value="清除全部" @click="clearItem('全部')" />
  <input type="button" value="清除已完成" @click="clearItem('已完成')" />
  <input type="button" value="清除未完成" @click="clearItem('未完成')" />
  <hr />
  <ul>
    <li v-for="(item, idx) in filteredItems" :key="item.id">
      <input type="checkbox" v-model="item.done" />
      <input
        type="text"
        v-if="item.edit"
        v-model="item.input"
        ref="listinput"
        v-focus
        @keydown.enter="saveItem(item)"
        @keydown.esc="cancelItem(item)"
      />
      <span @dblclick="editItem(item, idx)">
        <del v-if="item.done">{{ item.text }}</del>
        <span v-else>{{ item.text }}</span>
      </span>
      <input type="button" value="x" @click="delItem(item.id)" />
    </li>
  </ul>
</template>

<script setup>
import { ref, computed, reactive, useTemplateRef, watch, onMounted } from 'vue'

const filter = ref('全部')
const items = reactive([])
let id = 1
// 自訂 vue 指令
// https://zh-hk.vuejs.org/guide/reusability/custom-directives.html#introduction
const vFocus = {
  // 當元素被放到 DOM 時，執行 focus 聚焦輸入欄位
  mounted: (el) => el.focus(),
}

const listInputs = useTemplateRef('listinput')

const editItem = (item, idx) => {
  item.edit = true
  listInputs[idx].focus()
}

const input = ref('')

const inputBorder = computed(() => {
  if (input.value.length === 0) {
    return '5px solid black'
  } else if (input.value.length < 2) {
    return '5px solid red'
  } else {
    return '5px solid blue'
  }
})

const addItem = () => {
  if (input.value.length < 2) return

  items.push({
    id: id++,
    text: input.value,
    done: false,
    edit: false,
    input: input.value,
  })
}

const delItem = (id) => {
  const idx = items.findIndex((item) => item.id === id)
  items.splice(idx, 1)
}

const saveItem = (item) => {
  if (item.input.length < 2) return

  item.text = item.input
  item.edit = false
}

const cancelItem = (item) => {
  item.input = item.text
  item.edit = false
}

const doneItem = (value) => {
  for (const item of items) {
    item.done = value
  }
}

const filteredItems = computed(() => {
  return items.filter((item) => {
    if (filter.value === '全部') return true
    else if (filter.value === '已完成') return item.done === true
    else return item.done === false
  })
})

const clearItem = (value) => {
  const data = items.filter((item) => {
    if (value === '全部') return false
    else if (value === '已完成') return item.done === false
    else return item.done === true
  })
  items.splice(0, items.length, ...data)
}

watch(items, () => {
  localStorage.list20251203 = JSON.stringify(items)
})

onMounted(() => {
  if (localStorage.list20251203) {
    items.push(...JSON.parse(localStorage.list20251203))
    id = items.at(-1).id + 1
  }
})
</script>
