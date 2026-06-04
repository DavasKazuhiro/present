// item da lista "Últimas chamadas" — mostra código, disciplina, % de presença

function getAttendanceTone(presenca) {
  if (presenca >= 85) return 'high'
  if (presenca >= 75) return 'medium'
  return 'low'
}

function getAttendanceLabel(presenca) {
  if (presenca >= 85) return 'Regular'
  if (presenca >= 75) return 'Observação'
  return 'Atenção'
}

// cores do badge de presença
const TONE_CLASSES = {
  high:   'bg-success-bg text-success-text',
  medium: 'bg-warning-bg text-warning-text',
  low:    'bg-danger-bg text-danger-text',
}

export function AttendanceListItem({ chamada, onMenu }) {
  const tone = getAttendanceTone(chamada.presenca)
  const label = getAttendanceLabel(chamada.presenca)

  return (
    <article
      className="flex items-center gap-3.5 py-[13px] border-b border-border-default last:border-b-0
        transition-colors duration-150
        hover:bg-[rgba(240,253,247,0.55)] hover:rounded-md hover:-mx-2.5 hover:px-2.5"
      aria-label={`Chamada ${chamada.codigo}, ${chamada.disciplina}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3 mb-[5px]">
          <div className="min-w-0 flex items-baseline gap-1.5">
            <span className="text-xs font-semibold text-neutral-900 whitespace-nowrap">
              {chamada.codigo}
            </span>
            <strong className="text-[13px] font-medium text-neutral-900 truncate">
              {chamada.disciplina}
            </strong>
          </div>

          <span className={`inline-flex items-center justify-center min-w-[88px]
            rounded-full px-[7px] py-[3px] text-[10px] font-semibold whitespace-nowrap
            ${TONE_CLASSES[tone]}`}>
            {chamada.presenca}% · {label}
          </span>
        </div>

        <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
          <span>Turma {chamada.turma}</span>
          <span aria-hidden="true">•</span>
          <span>Última chamada em {chamada.ultimaChamada}</span>
        </div>
      </div>

      <button
        className="w-[30px] h-[30px] bg-transparent border-none cursor-pointer text-neutral-400
          text-[17px] rounded-md inline-flex items-center justify-center shrink-0
          transition-colors duration-150
          hover:text-neutral-700 hover:bg-gray-100
          focus-visible:outline-2 focus-visible:outline-success focus-visible:outline-offset-2"
        onClick={() => onMenu?.(chamada)}
        aria-label={`Abrir opções da chamada ${chamada.codigo}`}
        type="button"
      >
        <i className="ti ti-dots-vertical" aria-hidden="true" />
      </button>
    </article>
  )
}
