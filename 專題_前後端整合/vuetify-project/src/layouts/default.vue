<template>
  <v-app-bar>
    <v-container class="d-flex align-center">
      <v-app-bar-title>購物網站</v-app-bar-title>
      <template v-for="nav in navs" :key="nav.to">
        <v-btn v-if="nav.show" :prepend-icon="nav.icon" :to="nav.to">
          {{ nav.title }}
        </v-btn>
      </template>
      <v-btn v-if="user.isLoggedIn" prepend-icon="mdi-logout" @click="logout">登出</v-btn>
    </v-container>
  </v-app-bar>
  <v-main>
    <router-view />
  </v-main>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from 'vuetify-use-dialog'
import serviceUser from '@/services/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const user = useUserStore()
const createSnackbar = useSnackbar()

const navs = computed(() => [
  { title: '首頁', to: '/', icon: 'mdi-home', show: true },
  { title: '註冊', to: '/register', icon: 'mdi-account-plus', show: !user.isLoggedIn },
  { title: '登入', to: '/login', icon: 'mdi-login', show: !user.isLoggedIn },
  { title: '購物車', to: '/cart', icon: 'mdi-cart', show: user.isLoggedIn },
  { title: '訂單', to: '/orders', icon: 'mdi-invoice-list', show: user.isLoggedIn },
  { title: '管理', to: '/admin', icon: 'mdi-cog', show: user.isLoggedIn && user.isAdmin },
])

const logout = async () => {
  try {
    await serviceUser.logout()
  } catch (error) {
    console.log(error)
  }
  user.logout()
  router.push('/')
  createSnackbar({
    text: '登出成功',
    snackbarProps: {
      color: 'green',
    },
  })
}
</script>
