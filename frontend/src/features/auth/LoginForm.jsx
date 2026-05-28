// Formulário de login.
// Pega email + senha, chama o auth.service, e redireciona conforme o role.

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User } from 'lucide-react'
import { getDashboardPath, login } from '../../services/auth.service'
import Button from '../../components/common/Button/Button'
import PasswordInput from './PasswordInput'

export default function LoginForm() {
  const navigate = useNavigate()

  // Estados dos campos
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Estados da UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault() // Evita o form recarregar a página

    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail || !password.trim()) {
      setError('Preencha e-mail e senha.')
      return
    }

    setError('')
    setLoading(true)

    const result = await login(normalizedEmail, password)

    setLoading(false)

    if (result.success) {
      navigate(getDashboardPath(result.user.role))
    } else {
      // Login deu errado, mostra o erro
      setError(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      {/* Campo de email/matrícula */}
      <div className="relative">
        <User
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          autoComplete="email"
          className="w-full bg-transparent border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-slate-700 placeholder-slate-500 focus:outline-none focus:border-primary-400"
        />
      </div>

      {/* Campo de senha (componente já feito) */}
      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />

      {/* Mensagem de erro — só aparece se tiver erro */}
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {/* Botão de submit */}
      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>

      <p className="text-slate-400 text-sm">
        Ainda não tem conta?{' '}
        <Link className="text-primary-500 hover:text-primary-300" to="/cadastro">
          Criar cadastro
        </Link>
      </p>
    </form>
  )
}
