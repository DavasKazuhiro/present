
import axios from 'axios'

// URL base do back 
const API_BASE_URL = 'http://localhost:8800'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    // Quando implementarmos token, descomentar:
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

//funçnão para lidar com respostas de erro, como token expirado 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Quando implementarmos token, descomentar:
    // if (error.response?.status === 401) {
    //   localStorage.removeItem('token')
    //   window.location.href = '/login'
    // }
    return Promise.reject(error)
  }
)