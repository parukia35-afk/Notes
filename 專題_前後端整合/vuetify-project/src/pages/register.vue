<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">註冊</h1>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12">
        <v-form :disabled="form.isSubmitting.value" @submit.prevent="submit">
          <v-text-field
            v-model="account.value.value"
            counter
            :error-messages="account.errorMessage.value"
            hint="長度 4 ~ 20 的英數字"
            label="帳號"
            maxlength="20"
            minlength="4"
          />
          <v-text-field
            v-model="password.value.value"
            counter
            :error-messages="password.errorMessage.value"
            hint="長度 4 ~ 20 的英數字"
            label="密碼"
            maxlength="20"
            minlength="4"
            type="password"
          />
          <v-text-field
            v-model="confirmPassword.value.value"
            counter
            :error-messages="confirmPassword.errorMessage.value"
            hint="長度 4 ~ 20 的英數字"
            label="確認密碼"
            maxlength="20"
            minlength="4"
            type="password"
          />
          <v-btn :loading="form.isSubmitting.value" type="submit">註冊</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import validator from 'validator'
import { useField, useForm } from 'vee-validate'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import * as yup from 'yup'
import serviceUser from '@/services/user'

const createSnackbar = useSnackbar()
const router = useRouter()

const schema = yup.object({
  account: yup
    // 資料型態
    .string()
    // 必填
    .required('帳號必填')
    // 最短長度
    .min(4, '帳號最少 4 個字')
    // 最長長度
    .max(20, '帳號最多 20 個字')
    // 自訂驗證規則(自訂名稱, 錯誤訊息, function)
    .test('isAlphanumeric', '帳號只能是英數字', (value) => validator.isAlphanumeric(value)),
  password: yup
    .string()
    .required('密碼必填')
    .min(4, '密碼最少 4 個字')
    .max(20, '密碼最多 20 個字')
    .test('isAscii', '密碼只能是英數字', (value) => validator.isAscii(value)),
  confirmPassword: yup
    .string()
    .required('密碼必填')
    .min(4, '密碼最少 4 個字')
    .max(20, '密碼最多 20 個字')
    .test('isAscii', '密碼只能是英數字', (value) => validator.isAscii(value))
    // 限制值必須是陣列中的其中一個
    // .oneOf(陣列, 錯誤訊息)
    // 取得其他欄位的值當參照
    // yup.ref(欄位名稱)
    .oneOf([yup.ref('password')], '密碼不一致'),
})

// 建立表單
const form = useForm({
  // 設定表單的驗證規則
  validationSchema: schema,
  // 設定表單的欄位預設值
  initialValues: {
    account: '',
    password: '',
    confirmPassword: '',
  },
})

// 建立表單欄位
const account = useField('account')
const password = useField('password')
const confirmPassword = useField('confirmPassword')

// 送出表單
const submit = form.handleSubmit(async (values) => {
  try {
    await serviceUser.create(values)
    createSnackbar({
      text: '註冊成功',
      snackbarProps: {
        color: 'green',
      },
    })
    router.push('/login')
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
  title: 註冊
  login: no-login-only
</route>
