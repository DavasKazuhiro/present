import RegisterForm from '../features/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-neutral-0 p-6 sm:p-10 rounded-xl">
        <h1 className="text-neutral-900 text-3xl font-bold mb-2">Criar conta</h1>
        <p className="text-neutral-400 mb-8">Faça seu cadastro para acessar o Present.</p>
        <RegisterForm />
      </div>
    </div>
  )
}
