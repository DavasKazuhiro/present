import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, CircleCheck, CircleX, Download, MapPin } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout/AppLayout'
import { getAttendanceDetail } from '../services/classes.service'

const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function formatDate(iso) {
  const d = new Date(`${iso}T00:00:00`)
  return `${String(d.getDate()).padStart(2, '0')} ${meses[d.getMonth()]} ${d.getFullYear()}`
}

function downloadAttendanceCSV(attendance, students) {
  const header = [
    `Chamada: ${attendance.title}`,
    `Data: ${formatDate(attendance.date)}`,
    `Horário: ${attendance.time}`,
    `Duração: ${attendance.durationMin} min`,
    `Presença: ${attendance.rate.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%`,
    `Presentes: ${attendance.present}`,
    `Ausentes: ${attendance.absent}`,
    `Conteúdo: ${attendance.content || 'Sem conteúdo informado'}`,
    '',
    'Nome,Email,Situação',
  ].join('\n')

  const rows = students
    .map((s) => `${s.name},${s.email},${s.present ? 'Presente' : 'Ausente'}`)
    .join('\n')

  const blob = new Blob(['\uFEFF' + `${header}\n${rows}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `chamada-${attendance.title}-${attendance.date}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AttendanceDetailPage() {
  const { id, attendanceId } = useParams()
  const navigate = useNavigate()
  const [attendance, setAttendance] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadAttendance() {
      try {
        const detail = await getAttendanceDetail(id, attendanceId)
        if (!isMounted) return
        setAttendance(detail.attendance)
        setStudents(detail.students)
      } catch {
        if (isMounted) setError('Chamada não encontrada.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadAttendance()

    return () => {
      isMounted = false
    }
  }, [id, attendanceId])

  if (loading) {
    return (
      <AppLayout>
        <div className="px-7 py-12 text-sm text-text-secondary">Carregando chamada...</div>
      </AppLayout>
    )
  }

  if (!attendance) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center gap-3 px-7 py-20 text-center">
          <p className="text-lg font-semibold text-text-primary">{error}</p>
          <button
            type="button"
            onClick={() => navigate(`/teacher/classes/${id}`)}
            className="text-sm font-semibold text-primary-700 hover:underline"
          >
            Voltar
          </button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-4 px-7 py-6 pb-12 max-sm:px-4">
        <nav className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => navigate(`/teacher/classes/${id}`)}
            aria-label="Voltar"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border-default text-text-secondary transition hover:bg-neutral-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-text-secondary">{attendance.class.name}</span>
          <span className="text-text-muted">/</span>
          <span className="font-semibold text-text-primary">{attendance.title}</span>
        </nav>

        <section className="rounded-lg border border-border-default bg-bg-card p-6 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                  attendance.isOpen
                    ? 'bg-success-50 text-success-900'
                    : 'bg-neutral-100 text-text-secondary'
                }`}
              >
                <CircleCheck className="h-3 w-3" />
                {attendance.isOpen ? 'Aberta' : 'Encerrada'}
              </span>
              <h1 className="mt-3 text-3xl font-bold text-text-primary max-sm:text-2xl">
                {attendance.title}
              </h1>
              <p className="mt-1 font-mono text-[13px] text-text-secondary">
                {formatDate(attendance.date)} · {attendance.time} · duração {attendance.durationMin} min
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-text-secondary">
                <MapPin className="h-4 w-4" />
                Raio validado: {attendance.radiusMeters}m
              </p>
            </div>

            <div className="flex gap-6">
              <div className="text-right">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">Presença</div>
                <div className="mt-0.5 text-4xl font-bold leading-tight text-success-600">
                  {attendance.rate.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%
                </div>
              </div>
              <div className="w-px bg-border-default" />
              <div className="flex flex-col justify-center gap-2">
                <div className="text-sm">
                  <strong className="font-semibold">{attendance.present}</strong>{' '}
                  <span className="text-text-secondary">presentes</span>
                </div>
                <div className="text-sm">
                  <strong className="font-semibold">{attendance.absent}</strong>{' '}
                  <span className="text-text-secondary">ausentes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-border-default pt-[18px]">
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
              Conteúdo ministrado
            </div>
            <p className="text-sm leading-relaxed text-neutral-700">
              {attendance.content || 'Sem conteúdo informado.'}
            </p>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => downloadAttendanceCSV(attendance, students)}
            className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-bg-card px-[18px] py-2.5 text-sm font-semibold text-primary-700 transition hover:border-primary-200 hover:bg-primary-50"
          >
            <Download className="h-[18px] w-[18px]" />
            Baixar lista de presença
          </button>
        </div>

        <div className="mt-2">
          <h2 className="mb-3 text-xl font-bold text-text-primary">Alunos</h2>
          <div className="overflow-hidden rounded-lg border border-border-default bg-bg-card shadow-card">
            {students.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-text-secondary">
                Nenhum aluno estava matriculado nesta matéria.
              </div>
            ) : (
              <ul className="divide-y divide-border-default">
                {students.map((student) => (
                  <li key={student.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text-primary">{student.name}</p>
                      <p className="truncate text-xs text-text-secondary">{student.email}</p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        student.present
                          ? 'bg-success-50 text-success-600'
                          : 'bg-danger-50 text-danger-600'
                      }`}
                    >
                      {student.present ? (
                        <CircleCheck className="h-3.5 w-3.5" />
                      ) : (
                        <CircleX className="h-3.5 w-3.5" />
                      )}
                      {student.present ? 'Respondeu' : 'Não respondeu'}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
