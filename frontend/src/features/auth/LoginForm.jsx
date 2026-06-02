// Formulário de login.
// Pega email + senha, chama o auth.service, e redireciona conforme o role.

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDashboardPath, login } from '../../services/auth.service'
import Button from '../../components/common/Button/Button'
import PasswordInput from './PasswordInput'

export default function LoginForm() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

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
      setError(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      {/* campo de email */}
      <div className="relative">
        <i
          className="ti ti-user absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          style={{ fontSize: 20 }}
          aria-hidden="true"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
          autoComplete="email"
          className="w-full bg-transparent border border-neutral-200 rounded-lg py-3 pl-12 pr-4 text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-primary-400"
        />
      </div>

      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />

      {error && (
        <p className="text-danger-400 text-sm" role="alert">{error}</p>
      )}

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>

      <p className="text-neutral-400 text-sm">
        Ainda não tem conta?{' '}
        <Link className="text-primary-500 hover:text-primary-300" to="/cadastro">
          Criar cadastro
        </Link>
      </p>
    </form>
  )
}
