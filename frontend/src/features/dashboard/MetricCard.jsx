// card de métrica do topo do dashboard (ex: "4 Aulas hoje", "87% Frequência média")

export function MetricCard({ icon, value, label, delta, deltaType = 'positive', darkIcon = false }) {
  // cor do delta muda conforme o tipo
  const deltaColors = {
    positive: 'text-success-600',
    negative: 'text-danger-600',
    neutral:  'text-neutral-400',
  }

  return (
    <div className="bg-neutral-0 border border-border-default rounded-lg px-[22px] py-5
      flex items-center gap-4 shadow-card transition-[box-shadow,transform] duration-200
      hover:shadow-[0_4px_20px_rgba(0,0,0,0.09)] hover:-translate-y-px cursor-default">

      {/* ícone — pode ser escuro (fundo dark) ou claro */}
      <div className={`w-12 h-12 rounded-md flex items-center justify-center shrink-0 text-[22px]
        ${darkIcon
          ? 'bg-surface-800 text-neutral-0'
          : 'bg-neutral-50 border border-border-default text-neutral-500'
        }`}>
        <i className={`${icon}`} aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-[3px] min-w-0">
        <span className="text-[28px] font-bold text-neutral-900 leading-none tracking-tight block">
          {value}
        </span>
        <span className="text-xs text-neutral-500 block">{label}</span>
        {delta && (
          <span className={`text-[11px] font-medium mt-px block ${deltaColors[deltaType]}`}>
            {delta}
          </span>
        )}
      </div>
    </div>
  )
}
