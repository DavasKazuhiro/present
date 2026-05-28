const STORAGE_KEYS = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  user: 'user',
}

const ROLE_ALIASES = {
  aluno: 'aluno',
  student: 'aluno',
  professor: 'professor',
  teacher: 'professor',
}

export function normalizeRole(role) {
  if (typeof role !== 'string') return null
  return ROLE_ALIASES[role.trim().toLowerCase()] ?? null
}

export function getDashboardPath(role) {
  const normalizedRole = normalizeRole(role)

  if (normalizedRole === 'professor') return '/dashboard/teacher'
  if (normalizedRole === 'aluno') return '/dashboard/student'

  return '/login'
}

export function saveAuthSession({ user, accessToken, refreshToken }) {
  const normalizedRole = normalizeRole(user?.role)

  if (!normalizedRole || !accessToken || !refreshToken) {
    throw new Error('Sessão de autenticação inválida.')
  }

  localStorage.setItem(
    STORAGE_KEYS.user,
    JSON.stringify({ ...user, role: normalizedRole })
  )
  localStorage.setItem(STORAGE_KEYS.accessToken, accessToken)
  localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken)
}

export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEYS.user)
  localStorage.removeItem(STORAGE_KEYS.accessToken)
  localStorage.removeItem(STORAGE_KEYS.refreshToken)
}

export function getAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.accessToken)
}

export function getRefreshToken() {
  return localStorage.getItem(STORAGE_KEYS.refreshToken)
}

export function getCurrentUser() {
  const userJson = localStorage.getItem(STORAGE_KEYS.user)
  if (!userJson) return null

  try {
    const user = JSON.parse(userJson)
    const normalizedRole = normalizeRole(user?.role)

    if (!normalizedRole) {
      clearAuthSession()
      return null
    }

    return { ...user, role: normalizedRole }
  } catch {
    clearAuthSession()
    return null
  }
}
