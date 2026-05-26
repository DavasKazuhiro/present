import LoginForm from '../features/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-white text-3xl font-bold mb-2">Bem-vindo de volta.</h1>
        <p className="text-slate-400 mb-8">Faça login com sua conta institucional.</p>

        <LoginForm />
      </div>
    </div>
  )
}