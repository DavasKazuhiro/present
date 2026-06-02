import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button/Button'
import PasswordInput from './PasswordInput'
import { getDashboardPath, register } from '../../services/auth.service'

export default function RegisterForm() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('aluno')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedName || !normalizedEmail || !password.trim()) {
      setError('Preencha nome, e-mail e senha.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (password !== confirmPassword) {
      setError('As senhas não conferem.')
      return
    }

    setError('')
    setLoading(true)
    const result = await register({
      name: normalizedName,
      email: normalizedEmail,
      password,
      role,
    })
    setLoading(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    navigate(getDashboardPath(result.user.role))
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      <div className="relative">
        <i
          className="ti ti-user absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          style={{ fontSize: 20 }}
          aria-hidden="true"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome completo"
          autoComplete="name"
          className="w-full bg-transparent border border-neutral-200 rounded-lg py-3 pl-12 pr-4 text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-primary-400"
        />
      </div>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-mail"
        autoComplete="email"
        className="w-full bg-transparent border border-neutral-200 rounded-lg py-3 px-4 text-neutral-700 placeholder-neutral-400 focus:outline-none focus:border-primary-400"
      />

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full bg-white border border-neutral-200 rounded-lg py-3 px-4 text-neutral-700 focus:outline-none focus:border-primary-400"
      >
        <option value="aluno">Aluno</option>
        <option value="professor">Professor</option>
      </select>

      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
      />

      <PasswordInput
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirmar senha"
        autoComplete="new-password"
      />

      {error && <p className="text-danger-400 text-sm" role="alert">{error}</p>}

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? 'Cadastrando...' : 'Criar conta'}
      </Button>

      <p className="text-neutral-400 text-sm">
        Já tem conta?{' '}
        <Link className="text-primary-400 hover:text-primary-300" to="/login">
          Ir para login
        </Link>
      </p>
    </form>
  )
}
