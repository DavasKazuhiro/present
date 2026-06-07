import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Download, Users, CircleCheck } from 'lucide-react'
import { AppLayout } from '../layout/AppLayout/AppLayout'
import { turmaInfo, chamadas } from '../mocks/class.mock'

const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return `${String(d.getDate()).padStart(2, '0')} ${meses[d.getMonth()]} ${d.getFullYear()}`
}

export default function AttendanceDetailPage() {
  const { attendanceId } = useParams()
  const navigate = useNavigate()

  const attendance = chamadas.find((c) => c.id === attendanceId)

  // se o id não existir no mock, mostra um aviso simples
  if (!attendance) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center gap-3 px-7 py-20 text-center">
          <p className="text-lg font-semibold text-text-primary">Chamada não encontrada</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm font-semibold text-primary-700 hover:underline"
          >
            ← Voltar
          </button>
        </div>
      </AppLayout>
    )
  }

  function handleBaixar() {
    // TODO: gerar a lista no formato da faculdade
    console.log('baixar lista', attendance.id)
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-4 px-7 py-6 pb-12 max-sm:px-4">
        {/* breadcrumb */}
        <nav className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border-default text-text-secondary transition hover:bg-neutral-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-text-secondary">{turmaInfo.name}</span>
          <span className="text-text-muted">/</span>
          <span className="font-semibold text-text-primary">
            Aula {attendance.lessonNumber} · {attendance.title}
          </span>
        </nav>

        {/* header da chamada */}
        <section className="rounded-2xl border border-border-default bg-bg-card p-6 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-success-900">
                <CircleCheck className="h-3 w-3" /> Encerrada
              </span>
              <h1 className="mt-3 text-3xl font-bold text-text-primary max-sm:text-2xl">
                Aula {attendance.lessonNumber} · {attendance.title}
              </h1>
              <p className="mt-1 font-mono text-[13px] text-text-secondary">
                {formatDate(attendance.date)} · {attendance.time} · duração {attendance.durationMin} min
              </p>
            </div>

            {/* resumo */}
            <div className="flex gap-6">
              <div className="text-right">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">Presença</div>
                <div className="mt-0.5 text-4xl font-bold leading-tight text-success-600">
                  {attendance.rate.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%
                </div>
              </div>
              <div className="w-px bg-border-default" />
              <div className="flex flex-col justify-center gap-2">
                <div className="text-sm"><strong className="font-semibold">{attendance.present}</strong> <span className="text-text-secondary">presentes</span></div>
                <div className="text-sm"><strong className="font-semibold">{attendance.absent}</strong> <span className="text-text-secondary">faltas</span></div>
              </div>
            </div>
          </div>

          {/* conteúdo ministrado */}
          <div className="mt-5 border-t border-border-default pt-[18px]">
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
              Conteúdo ministrado
            </div>
            <p className="text-sm leading-relaxed text-neutral-700">
              {attendance.title}
            </p>
          </div>
        </section>

        {/* ações */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleBaixar}
            className="inline-flex items-center gap-2 rounded-xl border border-border-default bg-bg-card px-[18px] py-2.5 text-sm font-semibold text-primary-700 transition hover:border-primary-200 hover:bg-primary-50"
          >
            <Download className="h-[18px] w-[18px]" /> Baixar lista de presença
          </button>
        </div>

        {/* lista de alunos — vazia (front) */}
        <div className="mt-2">
          <h2 className="mb-3 text-xl font-bold text-text-primary">Alunos</h2>
          <div className="rounded-2xl border border-border-default bg-bg-card px-6 py-12 text-center shadow-card">
            <div className="mx-auto mb-3.5 inline-flex h-[52px] w-[52px] items-center justify-center rounded-full bg-neutral-50">
              <Users className="h-6 w-6 text-neutral-300" />
            </div>
            <p className="text-[15px] font-semibold text-neutral-600">
              A lista de alunos aparecerá aqui
            </p>
            <p className="mx-auto mt-1 max-w-sm text-[13px] leading-relaxed text-text-muted">
              Quando conectada ao sistema, a presença individual de cada aluno será exibida nesta lista.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}