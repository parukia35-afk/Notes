import { useApi } from '@/composables/api'

const { api, apiAuth } = useApi()

export default {
  create: (data) => {
    return api.post('/user', data)
  },
  login (data) {
    return api.post('/user/login', data)
  },
  profile () {
    return apiAuth.get('/user/profile')
  },
  refresh () {
    return apiAuth.patch('/user/refresh')
  },
  logout () {
    return apiAuth.delete('/user/logout')
  },
}
