import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Copy, MailPlus, QrCode, RefreshCw, Trash2, UserCheck, Users } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout/AppLayout'
import ClassHeader from '../features/classes/ClassHeader'
import ClassActions from '../features/classes/ClassActions'
import AttendanceList from '../features/classes/AttendanceList'
import NewAttendanceModal from '../features/classes/NewAttendanceModal'
import LiveAttendanceModal from '../features/classes/LiveAttendanceModal'
import {
  closeAttendance,
  enrollStudent,
  getClassAttendances,
  getAttendanceDetail,
  getClassStudents,
  getInviteLink,
  getTeacherClass,
  openAttendance,
  regenerateInviteLink,
  removeStudent,
} from '../services/classes.service'
import { getPrecisePosition } from '../utils/geolocation'

const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function formatDate(iso) {
  const d = new Date(`${iso}T00:00:00`)
  return `${String(d.getDate()).padStart(2, '0')} ${meses[d.getMonth()]} ${d.getFullYear()}`
}

export default function TeacherClassPage() {
  const { id } = useParams()
  const turmaId = Number(id)
  const navigate = useNavigate()
  const [modal, setModal] = useState('none')
  const [activeAttendance, setActiveAttendance] = useState(null)
  const [turma, setTurma] = useState(null)
  const [students, setStudents] = useState([])
  const [attendances, setAttendances] = useState([])
  const [email, setEmail] = useState('')
  const [invite, setInvite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savingStudent, setSavingStudent] = useState(false)
  const [opening, setOpening] = useState(false)
  const [message, setMessage] = useState('')

  const proximoNumero = useMemo(() => attendances.length + 1, [attendances.length])

  async function loadClass() {
    setMessage('')
    try {
      const [classData, classStudents, classAttendances] = await Promise.all([
        getTeacherClass(turmaId),
        getClassStudents(turmaId),
        getClassAttendances(turmaId),
      ])

      setTurma(classData)
      setStudents(classStudents)
      setAttendances(classAttendances)

      const open = classAttendances.find((attendance) => attendance.isOpen)
      if (open) {
        setActiveAttendance({
          chamadaId: open.id,
          titulo: open.title,
          duracao: open.durationMin,
          expiresAt: open.expiresAt,
          secondsLeft: open.secondsLeft,
          present: open.present,
        })
      }
    } catch {
      setMessage('Não foi possível carregar esta matéria.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (turmaId) loadClass()
  }, [turmaId])

  useEffect(() => {
    if (!activeAttendance) return

    const id = setInterval(() => {
      getClassAttendances(turmaId).then((items) => {
        setAttendances(items)
        const live = items.find((item) => item.id === activeAttendance.chamadaId)
        if (live) {
          setActiveAttendance((current) => ({
            ...current,
            present: live.present,
            expiresAt: live.expiresAt,
            secondsLeft: live.secondsLeft,
            isOpen: live.isOpen,
          }))
          if (!live.isOpen) {
            setModal('none')
            setActiveAttendance(null)
            loadClass()
          }
        }
      })
    }, 5000)

    return () => clearInterval(id)
  }, [activeAttendance?.chamadaId, turmaId])

  function handleAbrirChamadaDetalhe(attendanceId) {
    navigate(`/teacher/classes/${turmaId}/attendances/${attendanceId}`)
  }

  async function handleStartAttendance(dados) {
    setOpening(true)
    setMessage('')

    try {
      const location = await getPrecisePosition({ desiredAccuracy: 20, timeoutMs: 5000 })
      const result = await openAttendance({
        turmaId,
        titulo: dados.titulo,
        conteudo: dados.conteudo,
        latitude: location.latitude,
        longitude: location.longitude,
        raioMetros: dados.raio,
        duracaoMinutos: dados.duracao,
      })

      if (!result.success) {
        setMessage(result.error)
        return
      }

      setActiveAttendance({
        ...dados,
        chamadaId: result.session.chamadaId,
        present: 0,
        expiresAt: result.session.expiresAt,
        latitude: result.session.latitude,
        longitude: result.session.longitude,
        accuracy: location.accuracy,
      })
      setModal('live')
      await loadClass()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Não foi possível ler sua localização.')
    } finally {
      setOpening(false)
    }
  }

  async function handleEndAttendance() {
    if (activeAttendance?.chamadaId) {
      await closeAttendance(activeAttendance.chamadaId)
    }
    setModal('none')
    setActiveAttendance(null)
    await loadClass()
  }

  async function handleAddStudent(event) {
    event.preventDefault()
    if (!email.trim()) return

    setSavingStudent(true)
    setMessage('')
    const result = await enrollStudent(turmaId, email)
    setSavingStudent(false)

    if (!result.success) {
      setMessage(result.error)
      return
    }

    setEmail('')
    await loadClass()
  }

  async function loadInvite() {
    try {
      setInvite(await getInviteLink(turmaId))
    } catch {
      setMessage('Não foi possível carregar o convite da matéria.')
    }
  }

  async function handleRegenerateInvite() {
    try {
      setInvite(await regenerateInviteLink(turmaId))
    } catch {
      setMessage('Não foi possível regenerar o convite.')
    }
  }

  async function handleCopyInvite() {
    if (!invite?.token) return
    await navigator.clipboard?.writeText(inviteUrl)
    setMessage('Link de convite copiado.')
  }

  async function handleRemoveStudent(alunoId) {
    const result = await removeStudent(turmaId, alunoId)
    if (!result.success) {
      setMessage(result.error)
      return
    }
    await loadClass()
  }

  async function handleBaixar(attendanceId) {
  try {
    const { attendance, students: attendanceStudents } = await getAttendanceDetail(turmaId, attendanceId)

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

    const rows = attendanceStudents
      .map((s) => `${s.name},${s.email},${s.present ? 'Presente' : 'Ausente'}`)
      .join('\n')

    const blob = new Blob(['\uFEFF' + `${header}\n${rows}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chamada-${attendance.title}-${attendance.date}.csv`
    a.click()
    URL.revokeObjectURL(url)
  } catch {
    setMessage('Não foi possível baixar a lista de presença.')
  }
}

  const inviteUrl = invite?.token ? `${window.location.origin}/join/${invite.token}` : ''
  const qrUrl = inviteUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(inviteUrl)}`
    : ''

  if (loading) {
    return (
      <AppLayout>
        <div className="px-7 py-12 text-sm text-text-secondary">Carregando matéria...</div>
      </AppLayout>
    )
  }

  if (!turma) {
    return (
      <AppLayout>
        <div className="flex flex-col gap-3 px-7 py-12">
          <p className="text-sm font-semibold text-danger-600">{message || 'Matéria não encontrada.'}</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard/teacher')}
            className="w-fit rounded-lg border border-border-default px-4 py-2 text-sm font-semibold"
          >
            Voltar
          </button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 px-7 py-6 pb-12 max-sm:px-4">
        <nav className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => navigate('/dashboard/teacher')}
            aria-label="Voltar para Matérias"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border-default text-text-secondary transition hover:bg-neutral-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-text-secondary">Matérias</span>
          <span className="text-text-muted">/</span>
          <span className="font-semibold text-text-primary">
            {turma.name} · {turma.section}
          </span>
        </nav>

        {message && (
          <div className="rounded-lg border border-danger-100 bg-danger-50 px-4 py-3 text-sm font-semibold text-danger-600">
            {message}
          </div>
        )}

        <ClassHeader info={{ ...turma, enrolledCount: students.length }} role="teacher"/>
        <ClassActions onAbrirChamada={() => setModal('config')} />

        <section className="grid grid-cols-[0.8fr_1.2fr] gap-4 max-lg:grid-cols-1">
          <div className="rounded-lg border border-border-default bg-bg-card p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-text-primary">Adicionar alunos</h2>
                <p className="text-sm text-text-secondary">Use o e-mail que o aluno cadastrou no app.</p>
              </div>
              <MailPlus className="h-5 w-5 text-primary-600" />
            </div>

            <form onSubmit={handleAddStudent} className="flex gap-2 max-sm:flex-col">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="aluno@email.com"
                className="h-11 min-w-0 flex-1 rounded-lg border border-border-default px-3 text-sm outline-none focus:border-primary-400"
              />
              <button
                type="submit"
                disabled={savingStudent}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary-800 px-4 text-sm font-semibold text-neutral-0 transition hover:bg-primary-900 disabled:opacity-60"
              >
                <UserCheck className="h-4 w-4" />
                {savingStudent ? 'Adicionando...' : 'Adicionar'}
              </button>
            </form>
          </div>

          <div className="rounded-lg border border-border-default bg-bg-card p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-primary">Alunos da matéria</h2>
              <span className="inline-flex items-center gap-1.5 text-sm text-text-secondary">
                <Users className="h-4 w-4" />
                {students.length}
              </span>
            </div>
            {students.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border-default px-4 py-8 text-center text-sm text-text-secondary">
                Nenhum aluno adicionado ainda.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between gap-2 rounded-lg border border-border-default px-3 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text-primary">{student.name}</p>
                      <p className="truncate text-xs text-text-secondary">{student.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveStudent(student.id)}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-danger-600 transition hover:bg-danger-50"
                      aria-label={`Remover ${student.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-border-default bg-bg-card p-5 shadow-card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-text-primary">Convite por QR Code</h2>
              <p className="text-sm text-text-secondary">
                Compartilhe com os alunos para entrarem automaticamente nesta matéria.
              </p>
            </div>
            <button
              type="button"
              onClick={invite ? handleRegenerateInvite : loadInvite}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border-default px-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
            >
              {invite ? <RefreshCw className="h-4 w-4" /> : <QrCode className="h-4 w-4" />}
              {invite ? 'Regenerar token' : 'Gerar convite'}
            </button>
          </div>

          {invite ? (
            <div className="grid grid-cols-[180px_1fr] gap-5 max-md:grid-cols-1">
              <img
                src={qrUrl}
                alt="QR Code do convite"
                className="h-[180px] w-[180px] rounded-lg border border-border-default bg-white p-2"
              />
              <div className="min-w-0">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">Link de convite</p>
                <div className="flex min-w-0 gap-2 max-sm:flex-col">
                  <input
                    readOnly
                    value={inviteUrl}
                    className="h-11 min-w-0 flex-1 rounded-lg border border-border-default bg-neutral-50 px-3 text-sm text-text-primary"
                  />
                  <button
                    type="button"
                    onClick={handleCopyInvite}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary-800 px-4 text-sm font-semibold text-neutral-0 transition hover:bg-primary-900"
                  >
                    <Copy className="h-4 w-4" />
                    Copiar
                  </button>
                </div>
                <p className="mt-2 text-xs text-text-secondary">
                  Usos: {invite.uses ?? 0}. Regenerar invalida o link anterior.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border-default px-4 py-8 text-center text-sm text-text-secondary">
              Gere um convite para exibir o QR Code e o link da matéria.
            </div>
          )}
        </section>

        <AttendanceList
          items={attendances}
          total={attendances.length}
          onBaixar={handleBaixar}
          onAbrir={handleAbrirChamadaDetalhe}
          onVerTodas={() => {}}
        />

        <NewAttendanceModal
          open={modal === 'config'}
          onClose={() => setModal('none')}
          turma={turma}
          proximoNumero={proximoNumero}
          opening={opening}
          onAbrir={handleStartAttendance}
        />

        <LiveAttendanceModal
          open={modal === 'live'}
          attendance={{ ...activeAttendance, opening }}
          turma={{ ...turma, enrolledCount: students.length }}
          onClose={handleEndAttendance}
          onDismiss={() => setModal('none')}
        />
      </div>
    </AppLayout>
  )
}
