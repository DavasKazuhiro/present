import { useEffect, useState } from 'react'
import { BellRing, RefreshCw } from 'lucide-react'
import { AppLayout } from '@/layout/AppLayout/AppLayout'
import { ClassList } from '../features/StudentTurmas/ClassList'
import { WeeklyCalendar } from '../features/calendar/WeeklyCalendar'
import { StudentCheckinModal } from './StudentCheckinModal'
import {
  confirmStudentCheckin,
  getStudentClasses,
  getStudentNotifications,
  getStudentSession,
} from '../services/classes.service'

export default function StudentTurmas() {
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [classes, setClasses] = useState([])
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadStudentData() {
    try {
      const [studentClasses, activeNotifications] = await Promise.all([
        getStudentClasses(),
        getStudentNotifications(),
      ])

      setClasses(studentClasses)
      setNotifications(activeNotifications)
      setError('')
    } catch {
      setError('Não foi possível carregar suas matérias.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudentData()
    const id = setInterval(loadStudentData, 5000)

    function refreshWhenVisible() {
      if (!document.hidden) loadStudentData()
    }

    window.addEventListener('focus', loadStudentData)
    window.addEventListener('online', loadStudentData)
    document.addEventListener('visibilitychange', refreshWhenVisible)

    return () => {
      clearInterval(id)
      window.removeEventListener('focus', loadStudentData)
      window.removeEventListener('online', loadStudentData)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
    }
  }, [])

  async function handleOpenCheckin(chamadaId) {
    try {
      const session = await getStudentSession(chamadaId)
      setSelectedSession(session)
      setCheckInOpen(true)
    } catch {
      setError('Esta chamada não está mais disponível.')
      await loadStudentData()
    }
  }

  async function handleConfirmCheckin(payload) {
    const result = await confirmStudentCheckin(payload)

    if (result.success) {
      await loadStudentData()
      setSelectedSession((current) => (current ? { ...current, answered: true } : current))
    }

    return result
  }

  const firstNotification = notifications[0]

  return (
    <AppLayout
      title="Turmas"
      calendar={
        <WeeklyCalendar
          subjects={classes}
          onSubjectClick={(turma) => {
            if (turma.activeSession && !turma.activeSession.answered) {
              handleOpenCheckin(turma.activeSession.id)
            }
          }}
        />
      }
    >
      <div className="flex flex-col gap-4 px-7 py-6 pb-12 max-sm:px-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Minhas matérias</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Chamadas abertas aparecem aqui automaticamente.
            </p>
          </div>
          <button
            type="button"
            onClick={loadStudentData}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-default bg-bg-card text-primary-700 transition hover:bg-primary-50"
            aria-label="Atualizar matérias"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-danger-100 bg-danger-50 px-4 py-3 text-sm font-semibold text-danger-600">
            {error}
          </div>
        )}

        {firstNotification && (
          <button
            type="button"
            onClick={() => handleOpenCheckin(firstNotification.id)}
            className="flex items-center justify-between gap-4 rounded-lg border border-success-100 bg-success-50 px-4 py-3 text-left transition hover:bg-success-100"
          >
            <span className="inline-flex min-w-0 items-center gap-3">
              <BellRing className="h-5 w-5 shrink-0 text-success-600" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-success-900">
                  Chamada aberta em {firstNotification.subject}
                </span>
                <span className="block truncate text-xs text-success-600">
                  {firstNotification.className} · raio de {firstNotification.radiusMeters}m
                </span>
              </span>
            </span>
            <span className="shrink-0 rounded-lg bg-success-600 px-3 py-2 text-xs font-semibold text-white">
              Responder
            </span>
          </button>
        )}

        {loading ? (
          <div className="rounded-lg border border-border-default bg-bg-card px-6 py-12 text-center text-sm text-text-secondary">
            Carregando matérias...
          </div>
        ) : (
          <ClassList items={classes} onOpenCheckin={handleOpenCheckin} />
        )}

        <StudentCheckinModal
          open={checkInOpen}
          session={selectedSession}
          onClose={() => {
            setCheckInOpen(false)
            setSelectedSession(null)
          }}
          onConfirm={handleConfirmCheckin}
        />
      </div>
    </AppLayout>
  )
}
