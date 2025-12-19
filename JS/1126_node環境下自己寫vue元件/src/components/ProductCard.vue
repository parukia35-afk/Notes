<template>
  <div class="card">
    <img :src="image" class="card-img" />
    <h5 class="card-title">{{ title }}</h5>
    <h6 class="card-price">{{ price }}</h6>
    <h6 class="card-warn" v-if="!sell">商品下架</h6>
    <p class="card-text">{{ text }}</p>
    <input type="button" value="看資訊" @click="show" />
  </div>
</template>

<style scoped>
.card {
  width: 100px;
  border: 1px solid black;
  display: inline-block;
}
.card-img {
  width: 100%;
}
</style>

<script setup>
import { toRef, toRefs } from 'vue'
// props = 元件接受哪些外部資料
// defineProps 是特殊語法不需要 import 就能用

// 用文字陣列指定義接收的資料名稱
// defineProps(['image', 'title', 'price', 'text', 'sell'])

const props = defineProps({
  // 只驗證資料型態
  // https://zh-hk.vuejs.org/guide/components/props.html#runtime-type-checks
  image: String,
  // 詳細
  title: {
    type: String,
    required: true,
    default() {
      return '商品標題'
    },
    validator(value) {
      return value.length > 1
    },
  },
  price: Number,
  text: String,
  sell: Boolean,
})

// props 直接解構會失去響應性
// const { price } = props
// 需要使用 toRef 或 toRefs 輔助
// const price = toRef(props, 'price')
const { price } = toRefs(props)
const show = () => {
  alert(props.price)
  alert(price.value)
}
</script>

<!--
<script>
export default {
  props: ['image', 'title', 'price', 'text', 'sell'],
  methods: {
    show() {
      alert(this.price)
    },
  },
  setup(props) {
    const show = () => {
      alert(props.price)
    }
    return {
      show,
    }
  },
}
</script>
-->
