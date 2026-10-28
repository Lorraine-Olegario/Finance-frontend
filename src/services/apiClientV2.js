import axios from 'axios'
import router from '../router'

// A API de Carteira (v2) vive em /api/v2, enquanto VITE_API_BASE_URL aponta
// para /api/v1 — por isso usa um client dedicado em vez de @src/services/api.js.
const V2_ROOT = (import.meta.env.VITE_API_BASE_URL || '').replace(
  /\/v\d+\/?$/,
  ''
)

const apiClientV2 = axios.create({
  baseURL: `${V2_ROOT}/v2`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

apiClientV2.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

apiClientV2.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default apiClientV2
