<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">商品管理</h1>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12">
        <v-data-table
          :filter-keys="['name', 'category', 'description', '_id', 'price', 'createdAt', 'updatedAt']"
          :headers="headers"
          :items="products"
          :search="search"
        >
          <template #top>
            <v-toolbar class="px-4">
              <v-text-field
                v-model="search"
                density="compact"
                flat
                hide-details
                placeholder="搜尋商品"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
              />
              <v-spacer />
              <v-btn variant="outlined" @click="openDialog(null)">新增商品</v-btn>
            </v-toolbar>
          </template>
          <template #[`item.imageUrl`]="{ value }">
            <v-img :src="value" width="75" />
          </template>
          <template #[`item.sell`]="{ value }">
            <v-icon v-if="value" icon="mdi-check" />
          </template>
          <template #[`item.action`]="{ item }">
            <v-btn icon="mdi-pencil" variant="text" @click="openDialog(item)" />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="dialog.open" persistent width="600">
    <v-form :disabled="form.isSubmitting.value" @submit.prevent="submit">
      <v-card>
        <v-card-title>{{ dialog.id ? '修改商品' : '新增商品' }}</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="name.value.value"
            :error-messages="name.errorMessage.value"
            label="商品名稱"
            maxlength="100"
            minlength="1"
            required
          />
          <v-text-field
            v-model="price.value.value"
            :error-messages="price.errorMessage.value"
            label="商品價格"
            min="0"
            required
            type="number"
          />
          <v-select
            v-model="category.value.value"
            :error-messages="category.errorMessage.value"
            :items="categoryOptions"
            label="商品分類"
            required
          />
          <v-textarea
            v-model="description.value.value"
            :error-messages="description.errorMessage.value"
            label="商品說明"
            maxlength="1000"
            rows="5"
          />
          <vue-file-agent
            ref="fileAgent"
            v-model="fileRecords"
            v-model:raw-model-value="rawFileRecords"
            accept="image/png,image/jpg,image/jpeg"
            :compact="false"
            deletable
            :max-files="1"
            max-size="1MB"
            theme="default"
          />
          <v-checkbox
            v-model="sell.value.value"
            :error-messages="sell.errorMessage.value"
            hide-details
            label="上架商品"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" :loading="form.isSubmitting.value" @click="closeDialog">取消</v-btn>
          <v-btn color="green" :loading="form.isSubmitting.value" type="submit">
            {{ dialog.id ? '修改' : '新增' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
import { useField, useForm } from 'vee-validate'
import { ref, useTemplateRef } from 'vue'
import { useSnackbar } from 'vuetify-use-dialog'
import * as yup from 'yup'
import serviceProduct from '@/services/product'

const createSnackbar = useSnackbar()

// ************************
// *       顯示商品        *
// ************************
const products = ref([])
const search = ref('')
const headers = [
  { title: 'ID', key: '_id' },
  { title: '圖片', key: 'imageUrl', sortable: false },
  { title: '名稱', key: 'name' },
  { title: '分類', key: 'category' },
  { title: '價格', key: 'price' },
  { title: '說明', key: 'description' },
  { title: '上架', key: 'sell' },
  { title: '建立日期', key: 'createdAt', value: item => new Date(item.createdAt).toLocaleString() },
  { title: '修改日期', key: 'updatedAt', value: item => new Date(item.createdAt).toLocaleString() },
  { title: '操作', key: 'action', sortable: false },
]
const getProducts = async () => {
  try {
    const { data } = await serviceProduct.getAll()
    products.value = data.result
  } catch {
    createSnackbar({
      text: '發生錯誤',
      snackbarProps: {
        color: 'red',
      },
    })
  }
}
getProducts()

// ************************
// *         表單          *
// ************************
const fileAgent = useTemplateRef('fileAgent')
const dialog = ref({
  // 控制 v-dialog 開關
  open: false,
  // 紀錄目前 v-dialog 表單的商品 id
  // 新增商品 --> 空的 id
  // 修改商品 --> 修改的商品 id
  id: '',
})

const openDialog = (item) => {
  if (item) {
    dialog.value.id = item._id
    name.value.value = item.name
    price.value.value = item.price
    description.value.value = item.description
    category.value.value = item.category
    sell.value.value = item.sell
  }
  dialog.value.open = true
}

const closeDialog = () => {
  dialog.value.open = false
  dialog.value.id = ''
  form.resetForm()
  fileAgent.value.deleteFileRecord()
}

const categoryOptions = ['手機', '電腦', '平板', '玩具', '食品', '衣服', '遊戲', '書籍', '其他']
const schema = yup.object({
  name: yup
    .string()
    .required('請輸入商品名稱')
    .min(1, '商品名稱最少 1 個字')
    .max(100, '商品名稱最多 100 個字'),
  price: yup
    .number()
    .typeError('請輸入商品價格')
    .required('請輸入商品價格')
    .min(0, '商品價格最少 0 元'),
  description: yup
    .string()
    .max(1000, '商品描述最多 1000 個字'),
  category: yup
    .string()
    .required('請選擇商品分類')
    .oneOf(categoryOptions, '商品分類不存在'),
  sell: yup
    .boolean()
    .required('請選擇商品狀態'),
})
const form = useForm({
  validationSchema: schema,
  initialValues: {
    name: '',
    price: 0,
    description: '',
    category: '',
    sell: false,
  },
})
const name = useField('name')
const price = useField('price')
const description = useField('description')
const category = useField('category')
const sell = useField('sell')
const fileRecords = ref([])
const rawFileRecords = ref([])

const submit = form.handleSubmit(async (values) => {
  // 圖片欄位的錯誤
  if (fileRecords.value[0]?.error) {
    createSnackbar({
      text: '圖片檔案無效',
      snackbarProps: {
        color: 'red',
      },
    })
    return
  }
  // 新增商品時必須要有圖片
  // 編輯商品沒選圖會沿用舊圖片
  if (!dialog.value.id && fileRecords.value.length === 0) {
    createSnackbar({
      text: '請上傳商品圖片',
      snackbarProps: {
        color: 'red',
      },
    })
    return
  }

  // 送出資料
  try {
    // 建立 form-data 格式的資料
    const fd = new FormData()
    fd.append('name', values.name)
    fd.append('price', values.price)
    fd.append('description', values.description)
    fd.append('category', values.category)
    fd.append('sell', values.sell)
    if (fileRecords.value.length > 0) {
      fd.append('image', fileRecords.value[0].file)
    }

    // 根據新增或編輯使用不同的 api
    await (dialog.value.id ? serviceProduct.update(dialog.value.id, fd) : serviceProduct.create(fd))

    createSnackbar({
      text: '操作成功',
      snackbarProps: {
        color: 'green',
      },
    })

    closeDialog()

    await getProducts()
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤'
    createSnackbar({
      text,
      snackbarProps: {
        color: 'red',
      },
    })
  }
})
</script>

<route lang="yaml">
meta:
  layout: admin
  title: '商品管理'
  login: login-only
  admin: true
</route>
