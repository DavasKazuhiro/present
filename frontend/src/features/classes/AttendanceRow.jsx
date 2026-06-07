import { Download } from 'lucide-react'

const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

function corDaTaxa(rate) {
  if (rate >= 85) return 'text-success-600'
  if (rate >= 75) return 'text-warning-600'
  return 'text-danger-600'
}

export default function AttendanceRow({ item, onBaixar, onAbrir }) {
  const data = new Date(item.date + 'T00:00:00')
  const dia = String(data.getDate()).padStart(2, '0')
  const mes = meses[data.getMonth()]

  return (
    <li
      onClick={() => onAbrir(item.id)}
      className="flex cursor-pointer items-center gap-5 px-5 py-4 transition hover:bg-neutral-50 max-sm:flex-wrap max-sm:gap-3"
    >
      <div className="flex w-12 flex-shrink-0 flex-col items-center">
        <span className="text-xl font-bold leading-none text-text-primary tabular-nums">{dia}</span>
        <span className="mt-0.5 text-[11px] font-medium tracking-wide text-text-secondary">{mes}</span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text-primary">
          Aula {item.lessonNumber} · {item.title}
        </p>
        <p className="mt-0.5 font-mono text-xs text-text-secondary">
          {item.time} · duração {item.durationMin} min
        </p>
      </div>

      <div className="flex items-baseline gap-4 text-sm max-sm:order-3">
        <span className="text-text-primary tabular-nums">
          <strong className="font-semibold">{item.present}</strong> <span className="text-text-secondary">presentes</span>
        </span>
        <span className="text-text-primary tabular-nums">
          <strong className="font-semibold">{item.absent}</strong>{' '}
          <span className="text-text-secondary">{item.absent === 1 ? 'falta' : 'faltas'}</span>
        </span>
      </div>

      <span className={`w-16 text-right text-sm font-bold tabular-nums ${corDaTaxa(item.rate)}`}>
        {item.rate.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}%
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onBaixar(item.id)
        }}
        aria-label={`Baixar lista da aula ${item.lessonNumber}`}
        className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-border-default bg-bg-card px-3 py-2 text-xs font-semibold text-primary-700 transition hover:border-primary-200 hover:bg-primary-50"
      >
        <Download className="h-4 w-4" strokeWidth={2} />
        <span className="max-sm:hidden">Baixar lista</span>
      </button>
    </li>
  )
}