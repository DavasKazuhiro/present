import { useNavigate } from 'react-router-dom'
import { logout } from '../services/auth.service'

export default function TeacherDashboardPage() {
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard Professor</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
        >
          Sair
        </button>
      </div>
    </div>
  )
}
