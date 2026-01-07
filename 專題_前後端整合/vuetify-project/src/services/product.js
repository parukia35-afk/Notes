import { useApi } from '@/composables/api'

const { api, apiAuth } = useApi()

export default {
  create: (data) => {
    return apiAuth.post('/product', data)
  },
  getAll: () => {
    return apiAuth.get('/product/all')
  },
  update: (id, data) => {
    return apiAuth.patch(`/product/${id}`, data)
  },
}
