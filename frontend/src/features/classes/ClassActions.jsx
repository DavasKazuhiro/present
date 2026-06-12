import { Radio, CalendarClock, ChartBar } from 'lucide-react'

// botão desabilitado pras features que ainda não fizemos
function BotaoEmBreve({ icon: Icon, label }) {
  return (
    <button
      type="button"
      disabled
      title="Em breve"
      className="relative flex cursor-not-allowed flex-col items-center justify-center gap-2 rounded-xl border border-border-default bg-bg-card px-5 py-7 opacity-70"
    >
      <span className="absolute right-3 top-3 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
        Em breve
      </span>
      <Icon className="h-6 w-6 text-neutral-400" strokeWidth={1.75} />
      <span className="text-sm font-semibold text-neutral-400">{label}</span>
    </button>
  )
}

export default function ClassActions({ onAbrirChamada, hasActiveAttendance = false }) {
  return (
    <section className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
      <button
        type="button"
        onClick={onAbrirChamada}
        className={`group flex flex-col items-center justify-center gap-2 rounded-xl px-5 py-7 shadow-card transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.99] ${
          hasActiveAttendance
            ? 'bg-success-600 hover:bg-success-900 focus-visible:outline-success-400'
            : 'bg-primary-800 hover:bg-primary-900 focus-visible:outline-primary-400'
        }`}
      >
        <Radio className="h-6 w-6 text-primary-200 transition group-hover:text-neutral-0" strokeWidth={1.75} />
        <span className="text-base font-semibold text-neutral-0">
          {hasActiveAttendance ? 'Chamada ocorrendo' : 'Abrir chamada'}
        </span>
      </button>

      <BotaoEmBreve icon={CalendarClock} label="Programar chamada" />
      <BotaoEmBreve icon={ChartBar} label="Relatório da turma" />
    </section>
  )
}
