// item de aula na lista "Aulas de hoje"

import { StatusBadge } from './StatusBadge'

const ACTION_ICON = {
  em_curso:     'activity',
  encerrada:    'file-description',
  programada:   'pencil',
  nao_definida: 'plus',
}

export function ClassListItem({ aula, onAction }) {
  const icon = ACTION_ICON[aula.status] ?? 'dots-horizontal'
  const isActive = aula.status === 'em_curso'

  return (
    <li className={`flex items-center gap-3.5 py-[11px] list-none transition-colors duration-150
      ${isActive
        ? 'bg-[#f0fdf7] rounded-md px-3 -mx-3 border-none'
        : 'border-b border-border-default last:border-b-0'
      }`}>

      {/* horário */}
      <div className="flex flex-col text-[11px] font-medium text-neutral-400 min-w-[44px] leading-relaxed shrink-0">
        <span>{aula.inicio}</span>
        <span>{aula.fim}</span>
      </div>

      {/* info da aula */}
      <div className="flex-1 flex flex-col gap-0.5 min-w-0">
        <span className="text-[13px] font-medium text-neutral-900 truncate">
          {aula.disciplina} · {aula.turma}
        </span>
        <span className="text-[11px] text-neutral-400">
          {aula.sala} · {aula.totalAlunos} alunos
          {isActive && ` · ${aula.presentes}/${aula.totalAlunos} presentes`}
          {aula.automatica && ' · auto.'}
          {aula.status === 'programada' && ' · programada'}
          {aula.status === 'nao_definida' && ' · não programada'}
          {aula.status === 'encerrada' && ` · ${aula.percentualPresenca}% presença`}
        </span>
      </div>

      <StatusBadge status={aula.status} />

      {/* botão de ação */}
      <button
        className={`flex items-center p-[5px] rounded-sm border-none cursor-pointer text-base
          transition-colors duration-150 shrink-0 bg-transparent
          ${isActive
            ? 'text-success-400 hover:text-success-600 hover:bg-success-50'
            : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100'
          }`}
        onClick={() => onAction?.(aula)}
        aria-label={`Ação para ${aula.disciplina} ${aula.turma}`}
      >
        <i className={`ti ti-${icon}`} aria-hidden="true" />
      </button>
    </li>
  )
}
