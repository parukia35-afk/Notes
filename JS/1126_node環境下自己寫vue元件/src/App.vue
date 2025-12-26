<template>
  <CounterBtn></CounterBtn>
  <CounterBtn></CounterBtn>
  <hr />
  <!--
    用標籤屬性把資料傳入元件
    price="1000"    <-- 文字
    :price="1000"   <-- 數字
    布林值，有寫 = true，沒寫 = false
  -->
  <ProductCard
    image="https://github.com/vuejs.png"
    title="Vue"
    :price="1000"
    sell
    text="Vue Vue Vue"
  />
  <hr />
  <ProductCard
    v-for="(product, idx) in products"
    :key="idx"
    :image="product.image"
    :title="product.title"
    :price="product.price"
    :sell="product.sell"
    :text="product.text"
  />
  <hr>
  <!-- 如果剛好 props 名稱和綁定的變數名稱一樣，可以使用 v-bind 一次綁定 -->
  <ProductCard v-for="(product, idx) in products" :key="idx" v-bind="product" />
  <input type="button" value="漲價" @click="changePrice" />
  <hr />
  總共按了{{goods}}個讚
  <br>
  <!-- 當外部接收到元件傳出的自訂事件'toggle'時，執行onGoodToggle函式 -->
  <GoodBtn @toggle="onGoodToggle"/>
  <GoodBtn @toggle="onGoodToggle"/>
  <GoodBtn @toggle="onGoodToggle"/>
</template>

<script setup>
import { ref,reactive } from 'vue'
import CounterBtn from './components/CounterBtn.vue'
import ProductCard from './components/ProductCard.vue'
import GoodBtn from './components/GoodBtn.vue'

const products = reactive([
  {
    price: 1000,
    sell: true,
    image: 'https://github.com/twbs.png',
    text: 'Bootstrap Bootstrap',
    title: 'Bootstrap',
  },
  {
    price: 2000,
    sell: false,
    image: 'https://github.com/wdaweb.png',
    text: 'WDA WDA',
    title: 'WDA',
  },
])

const changePrice = () => {
  products.forEach((product) => {
    product.price *= 2
  })
}
const goods = ref(0)
const onGoodToggle = (value) => {
  goods.value+=value?1:-1 //元件傳出的值是true時，goods.value+=1；傳出的值是false時，goods.value-=1

}

</script>

<!--選項式API寫法
<script>
import CounterBtn from './components/CounterBtn.vue'

export default {
  components: {
    CounterBtn,
  },
  data() {},
  setup() {},
}
</script>
-->
