import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppLayout } from '../layout/AppLayout/AppLayout'
import { Footer } from '../layout/Footer/Footer'
import { DashboardHeader } from '../features/dashboard/DashboardHeader'
import { MetricCard } from '../features/dashboard/MetricCard'
import { WeeklyCalendar } from '../features/calendar/WeeklyCalendar'
import { createTeacherClass, getTeacherClasses } from '../services/classes.service'
import { getCurrentUser } from '../services/auth.service'
import { TeacherClassCard} from '../features/dashboardProfessor/TeacherClassCard'

const INITIAL_FORM = {
  nome: '',
  disciplina: '',
  curso: '',
  descricao: '',
  cor: '#2563eb',
  turno: 'Noite',
  horaInicio: '19:00',
  horaFim: '21:00',
  horarios: [{ diaSemana: 2, horaInicio: '19:00', horaFim: '21:00' }],
}

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#9333ea', '#ea580c', '#0891b2', '#be123c', '#475569']
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

function formatDataHora() {
  const agora = new Date()
  const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const dia = dias[agora.getDay()]
  const hora = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${dia} · ${agora.getDate()} ${meses[agora.getMonth()]} · ${hora}`
}

export function TeacherDashboardPage() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const [classes, setClasses] = useState([])
  const [form, setForm] = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const metrics = useMemo(() => {
    const totalStudents = classes.reduce((sum, turma) => sum + Number(turma.enrolledCount ?? 0), 0)
    const openAttendances = classes.filter((turma) => turma.openSessionId).length
    const average =
      classes.length > 0
        ? Math.round(
            classes.reduce((sum, turma) => sum + Number(turma.semesterRate ?? 0), 0) / classes.length
          )
        : 0

    return { totalStudents, openAttendances, average }
  }, [classes])

  async function loadClasses() {
    setError('')
    try {
      setClasses(await getTeacherClasses())
    } catch {
      setError('Não foi possível carregar suas turmas.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClasses()
  }, [])

  async function handleCreateClass(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    const result = await createTeacherClass(form)
    setSaving(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    setForm(INITIAL_FORM)
    setClasses((current) => [result.class, ...current])
  }

  function updateSchedule(index, field, value) {
    setForm((prev) => ({
      ...prev,
      horarios: prev.horarios.map((schedule, currentIndex) =>
        currentIndex === index ? { ...schedule, [field]: value } : schedule
      ),
    }))
  }

  function addSchedule() {
    setForm((prev) => ({
      ...prev,
      horarios: [...prev.horarios, { diaSemana: 4, horaInicio: '19:00', horaFim: '21:00' }],
    }))
  }

  function removeSchedule(index) {
    setForm((prev) => ({
      ...prev,
      horarios: prev.horarios.filter((_, currentIndex) => currentIndex !== index),
    }))
  }

  return (
    <AppLayout
      calendar={
        <WeeklyCalendar
          subjects={classes}
          onSubjectClick={(turma) => navigate(`/teacher/classes/${turma.id}`)}
        />
      }
    >
      <DashboardHeader
        professorName={user?.name ?? 'Professor'}
        dataHora={formatDataHora()}
        onNotification={() => loadClasses()}
      />

      <div className="px-7 max-sm:px-4 py-6 pb-10 flex flex-col gap-4">
        <section className="grid grid-cols-3 max-lg:grid-cols-1 gap-3.5" aria-label="Métricas gerais">
          <MetricCard icon="fa-solid fa-book" value={classes.length} label="Turmas criadas" darkIcon />
          <MetricCard icon="fa-solid fa-clipboard-check" value={metrics.openAttendances} label="Chamadas abertas" darkIcon />
          <MetricCard
            icon="fa-solid fa-chart-line"
            value={`${metrics.average}%`}
            label="Frequência média"
            deltaType="positive"
            darkIcon
          />
        </section>

        <section className="grid grid-cols-[0.9fr_1.1fr] gap-4 max-xl:grid-cols-1">
          <form
            onSubmit={handleCreateClass}
            className="rounded-lg border border-border-default bg-neutral-0 p-5 shadow-card"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-text-primary">Criar Turma</h2>
                <p className="text-sm text-text-secondary">Depois adicione alunos pelo e-mail cadastrado.</p>
              </div>
              <i className="fa-solid fa-plus text-primary-600 text-[18px]" aria-hidden="true" />
            </div>

            <div className="grid gap-3">
              <input
                value={form.nome}
                onChange={(event) => setForm((prev) => ({ ...prev, nome: event.target.value }))}
                placeholder="Turma. Ex: Turma B Noite"
                required
                className="h-11 rounded-lg border border-border-default px-3 text-sm outline-none focus:border-primary-400"
              />
              <input
                value={form.disciplina}
                onChange={(event) => setForm((prev) => ({ ...prev, disciplina: event.target.value }))}
                placeholder="Disciplina. Ex: Engenharia de Software"
                required
                className="h-11 rounded-lg border border-border-default px-3 text-sm outline-none focus:border-primary-400"
              />
              <input
                value={form.curso}
                onChange={(event) => setForm((prev) => ({ ...prev, curso: event.target.value }))}
                placeholder="Curso"
                required
                className="h-11 rounded-lg border border-border-default px-3 text-sm outline-none focus:border-primary-400"
              />
              <textarea
                value={form.descricao}
                onChange={(event) => setForm((prev) => ({ ...prev, descricao: event.target.value }))}
                placeholder="Descrição da Turma"
                rows={2}
                className="resize-none rounded-lg border border-border-default px-3 py-2 text-sm outline-none focus:border-primary-400"
              />
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">Cor</p>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, cor: color }))}
                      aria-label={`Selecionar cor ${color}`}
                      className={`h-8 w-8 rounded-full border-2 ${form.cor === color ? 'border-neutral-900' : 'border-white'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={form.turno}
                  onChange={(event) => setForm((prev) => ({ ...prev, turno: event.target.value }))}
                  className="h-11 rounded-lg border border-border-default px-3 text-sm outline-none focus:border-primary-400"
                >
                  <option>Manhã</option>
                  <option>Tarde</option>
                  <option>Noite</option>
                  <option>Integral</option>
                </select>
                <input
                  type="time"
                  value={form.horaInicio}
                  onChange={(event) => setForm((prev) => ({ ...prev, horaInicio: event.target.value }))}
                  className="h-11 rounded-lg border border-border-default px-3 text-sm outline-none focus:border-primary-400"
                />
                <input
                  type="time"
                  value={form.horaFim}
                  onChange={(event) => setForm((prev) => ({ ...prev, horaFim: event.target.value }))}
                  className="h-11 rounded-lg border border-border-default px-3 text-sm outline-none focus:border-primary-400"
                />
              </div>
              <div className="rounded-lg border border-border-default p-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-bold text-text-primary">Horários semanais</p>
                  <button
                    type="button"
                    onClick={addSchedule}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700"
                  >
                    <i className="fa-solid fa-plus text-[14px]" aria-hidden="true" />
                    Adicionar horário
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {form.horarios.map((schedule, index) => (
                    <div key={`${schedule.diaSemana}-${index}`} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                      <select
                        value={schedule.diaSemana}
                        onChange={(event) => updateSchedule(index, 'diaSemana', Number(event.target.value))}
                        className="h-10 rounded-lg border border-border-default px-2 text-sm outline-none focus:border-primary-400"
                      >
                        {DAYS.map((day, dayIndex) => (
                          <option key={day} value={dayIndex}>
                            {day}
                          </option>
                        ))}
                      </select>
                      <input
                        type="time"
                        value={schedule.horaInicio}
                        onChange={(event) => updateSchedule(index, 'horaInicio', event.target.value)}
                        className="h-10 rounded-lg border border-border-default px-2 text-sm outline-none focus:border-primary-400"
                      />
                      <input
                        type="time"
                        value={schedule.horaFim}
                        onChange={(event) => updateSchedule(index, 'horaFim', event.target.value)}
                        className="h-10 rounded-lg border border-border-default px-2 text-sm outline-none focus:border-primary-400"
                      />
                      <button
                        type="button"
                        onClick={() => removeSchedule(index)}
                        disabled={form.horarios.length === 1}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-default text-danger-600 disabled:opacity-40"
                        aria-label="Remover horário"
                      >
                        <i className="fa-solid fa-trash text-[14px]" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {error && <p className="mt-3 text-sm font-semibold text-danger-600">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary-800 text-sm font-semibold text-neutral-0 transition hover:bg-primary-900 disabled:opacity-60"
            >
              <i className="fa-solid fa-plus text-[16px]" aria-hidden="true" />
              {saving ? 'Criando...' : 'Criar Turma'}
            </button>
          </form>

          <section className="rounded-lg border border-border-default bg-neutral-0 p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">Minhas Turmas</h2>
              <span className="text-sm text-text-secondary">{metrics.totalStudents} alunos matriculados</span>
            </div>

            {loading ? (
              <div className="py-10 text-center text-sm text-text-secondary">Carregando Turmas...</div>
            ) : classes.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border-default px-4 py-10 text-center text-sm text-text-secondary">
                Crie sua primeira turma para adicionar alunos e abrir chamadas.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {classes.map((turma) => (
                  <TeacherClassCard
                    key={turma.id}
                    turma={turma}
                    onClick={() => navigate(`/teacher/classes/${turma.id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        </section>
      </div>

      <Footer />
    </AppLayout>
  )
}

export default TeacherDashboardPage
