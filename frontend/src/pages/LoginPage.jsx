import Logo from '../components/common/Logo/Logo'
import LoginForm from '../features/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-neutral-0 p-6 sm:p-10 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <Logo size={42} />
          <span className="text-3xl font-bold text-primary-600">Present</span>
        </div>
        <p className="text-neutral-400 mb-8">Faça login com sua conta</p>

        <LoginForm />
      </div>
    </div>
  )
}
