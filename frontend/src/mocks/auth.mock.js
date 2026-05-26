
const fakeUsers = [
  {
    id: 1,
    name: 'Tutu',
    email: 'tutu@present.com',
    password: '123456',
    role: 'teacher',
  },
  {
    id: 2,
    name: 'Davi Lindo',
    email: 'davi@present.com',
    password: '123456',
    role: 'student',
  },
]

// Função que simula o POST /sessions
export function mockLogin(email, password) {
  return new Promise((resolve) => {
    // Espera 500ms antes de responder pra simular o tempo da rede
    setTimeout(() => {
      // Procura no array um user que bate email E senha
      const user = fakeUsers.find(
        (u) => u.email === email && u.password === password
      )

      if (user) {
        // Tira o password antes de devolver — back nunca manda senha de volta
        const { password: _, ...userSemSenha } = user
        resolve({ success: true, user: userSemSenha })
      } else {
        resolve({ success: false, error: 'E-mail ou senha incorretos.' })
      }
    }, 500)
  })
}