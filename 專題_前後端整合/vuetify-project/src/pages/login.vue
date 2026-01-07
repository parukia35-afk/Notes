<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">登入</h1>
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
          <v-btn :loading="form.isSubmitting.value" type="submit">登入</v-btn>
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
import { useUserStore } from '@/stores/user'

const createSnackbar = useSnackbar()
const router = useRouter()
const user = useUserStore()

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
})

// 建立表單
const form = useForm({
  // 設定表單的驗證規則
  validationSchema: schema,
  // 設定表單的欄位預設值
  initialValues: {
    account: '',
    password: '',
  },
})

// 建立表單欄位
const account = useField('account')
const password = useField('password')

// 送出表單
const submit = form.handleSubmit(async (values) => {
  try {
    // 呼叫 api 登入
    const { data } = await serviceUser.login(values)
    // 使用者資料存 pinia
    user.login(data.result)
    createSnackbar({
      text: '登入成功',
      snackbarProps: {
        color: 'green',
      },
    })
    router.push('/')
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
  title: 登入
  login: no-login-only
</route>
