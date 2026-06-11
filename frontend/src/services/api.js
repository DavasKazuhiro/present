import axios from 'axios'
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  saveAuthSession,
} from './auth.storage'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8800'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    Pragma: 'no-cache',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

let isRefreshing = false
let pendingRequests = []

function resolvePendingRequests(newToken) {
  pendingRequests.forEach((callback) => callback(newToken))
  pendingRequests = []
}

// Função para lidar com token expirado e tentar refresh.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    const isAuthRoute =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register') ||
      originalRequest?.url?.includes('/auth/refresh')

    if (status !== 401 || !originalRequest || originalRequest._retry || isAuthRoute) {
      return Promise.reject(error)
    }

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      clearAuthSession()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push((newToken) => {
          if (!newToken) {
            reject(error)
            return
          }
          originalRequest.headers = originalRequest.headers ?? {}
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          resolve(api(originalRequest))
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken })

      saveAuthSession({
        user: data.user,
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
      })

      resolvePendingRequests(data.tokens.accessToken)
      originalRequest.headers = originalRequest.headers ?? {}
      originalRequest.headers.Authorization = `Bearer ${data.tokens.accessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      resolvePendingRequests(null)
      clearAuthSession()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

api.defaults.validateStatus = (status) => status >= 200 && status < 300
