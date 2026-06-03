import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TeacherDashboardPage from './pages/TeacherDashboardPage'
import StudentTurmas from './pages/StudentTurmas'
import { getCurrentUser, getDashboardPath, validateSession } from './services/auth.service'

function ProtectedRoute({ allowedRoles, children }) {
  const user = getCurrentUser()

  if (!user) return <Navigate to="/login" replace />
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  return children
}

function GuestRoute({ children }) {
  const user = getCurrentUser()
  if (user) return <Navigate to={getDashboardPath(user.role)} replace />
  return children
}

export default function App() {
  const [loadingSession, setLoadingSession] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function bootstrapSession() {
      const user = getCurrentUser()

      if (user) {
        await validateSession()
      }

      if (isMounted) setLoadingSession(false)
    }

    bootstrapSession()

    return () => {
      isMounted = false
    }
  }, [])

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Carregando...
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/cadastro"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />

      <Route
        path="/dashboard/teacher"
        element={
          <ProtectedRoute allowedRoles={['professor']}>
            <TeacherDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/student"
        element={
          <ProtectedRoute allowedRoles={['aluno']}>
            <StudentTurmas />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}