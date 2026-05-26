// Tudo de autenticação fica aqui.
// O LoginForm chama essas funções sem saber se é mock ou back de verdade.

import { mockLogin } from '../mocks/auth.mock'

// Login do usuário ele chama o mock, depois tem que chamar o back
export async function login(email, password) {
  // mock
  const result = await mockLogin(email, password)

  // Se deu certo, guarda o user no localStorage pra não perder no F5
  if (result.success) {
    localStorage.setItem('user', JSON.stringify(result.user))
  }

  return result
}

// Logout
export function logout() {
  localStorage.removeItem('user')
}

// Pega o user logado do localStorage. Retorna null se ninguém tá logado.
export function getCurrentUser() {
  const userJson = localStorage.getItem('user')
  if (!userJson) return null

  try {
    return JSON.parse(userJson)
  } catch {
    // Se o JSON quebrou, limpa e finge que ninguém tá logado
    localStorage.removeItem('user')
    return null
  }
}