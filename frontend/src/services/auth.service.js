import { api } from './api'
import {
  clearAuthSession,
  getAccessToken,
  getCurrentUser,
  getDashboardPath,
  getRefreshToken,
  normalizeRole,
  saveAuthSession,
} from './auth.storage'

export {
  clearAuthSession,
  getAccessToken,
  getCurrentUser,
  getDashboardPath,
  getRefreshToken,
  normalizeRole,
  saveAuthSession,
}

function createSessionPayload(data) {
  return {
    user: { ...data.user, role: normalizeRole(data.user?.role) },
    accessToken: data.tokens?.accessToken,
    refreshToken: data.tokens?.refreshToken,
  }
}

export async function login(email, password) {
  try {
    const { data } = await api.post('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    })
    const payload = createSessionPayload(data)

    saveAuthSession(payload)
    return { success: true, ...payload }
  } catch (error) {
    const message = error?.response?.data?.error ?? 'Não foi possível fazer login.'
    return { success: false, error: message }
  }
}

export async function register({ name, email, password, role }) {
  try {
    const { data } = await api.post('/auth/register', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: normalizeRole(role),
    })
    const payload = createSessionPayload(data)

    saveAuthSession(payload)
    return { success: true, ...payload }
  } catch (error) {
    const message = error?.response?.data?.error ?? 'Não foi possível fazer cadastro.'
    return { success: false, error: message }
  }
}

export async function logout() {
  try {
    const refreshToken = getRefreshToken()

    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken })
    }
  } catch {
    // Ignora erro de rede/logout, mas limpa sessão local.
  } finally {
    clearAuthSession()
  }
}

export async function validateSession() {
  try {
    const { data } = await api.get('/auth/me')
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()

    if (accessToken && refreshToken) {
      saveAuthSession({ user: data.user, accessToken, refreshToken })
    }

    return { success: true, user: { ...data.user, role: normalizeRole(data.user?.role) } }
  } catch {
    clearAuthSession()
    return { success: false }
  }
}
