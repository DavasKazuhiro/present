// chip de evento no calendário semanal — mostra label com bolinha de status

const STATUS_LABELS = {
  em_curso: 'Em curso',
  encerrada: 'Encerrada',
  programada: 'Programada',
  nao_definida: 'Não definida',
}

// cada status tem cores diferentes
const STATUS_CLASSES = {
  em_curso:     'bg-success-bg text-success-text',
  encerrada:    'bg-[#eef2f1] text-surface-800',
  programada:   'bg-[#dbeafe] text-[#1e40af]',
  nao_definida: 'bg-gray-100 text-text-secondary border border-dashed border-border',
}

export function WeekCalendarChip({ label, status }) {
  const classes = STATUS_CLASSES[status] || STATUS_CLASSES.nao_definida

  return (
    <div
      className={`min-h-[25px] rounded-sm px-[7px] py-1 flex items-center gap-[5px]
        text-[10px] font-semibold leading-tight truncate
        shadow-[inset_0_0_0_1px_rgba(17,24,39,0.05)] ${classes}`}
      title={`${label} · ${STATUS_LABELS[status] ?? 'Status'}`}
      aria-label={`${label}. Status: ${STATUS_LABELS[status] ?? 'não informado'}`}
    >
      <span className="w-[5px] h-[5px] rounded-full shrink-0 bg-current" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </div>
  )
}
