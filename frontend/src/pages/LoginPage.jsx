import logo from '../assets/logo.png'
import LoginForm from '../features/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-neutral-0 p-10 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <img src={logo} alt="Present logo" className="h-14" />
          <span className="text-3xl font-bold text-primary-600">Present</span>
        </div>
        <p className="text-slate-400 mb-8">Faça login com sua conta</p>

        <LoginForm />
      </div>
    </div>
  )
}