import { StatusBadge } from './StatusBadge'
import styles from './ClassListItem.module.css'

const ACTION_ICON = {
  em_curso:     'activity',
  encerrada:    'file-description',
  programada:   'pencil',
  nao_definida: 'plus',
}

export function ClassListItem({ aula, onAction }) {
  const icon = ACTION_ICON[aula.status] ?? 'dots-horizontal'

  return (
    <li className={`${styles.item} ${aula.status === 'em_curso' ? styles.active : ''}`}>
      <div className={styles.time}>
        <span>{aula.inicio}</span>
        <span>{aula.fim}</span>
      </div>

      <div className={styles.info}>
        <span className={styles.name}>
          {aula.disciplina} · {aula.turma}
        </span>
        <span className={styles.sub}>
          {aula.sala} · {aula.totalAlunos} alunos
          {aula.status === 'em_curso' && ` · ${aula.presentes}/${aula.totalAlunos} presentes`}
          {aula.automatica && ' · auto.'}
          {aula.status === 'programada' && ' · programada'}
          {aula.status === 'nao_definida' && ' · não programada'}
          {aula.status === 'encerrada' && ` · ${aula.percentualPresenca}% presença`}
        </span>
      </div>

      <StatusBadge status={aula.status} />

      <button
        className={`${styles.actionBtn} ${aula.status === 'em_curso' ? styles.actionActive : ''}`}
        onClick={() => onAction?.(aula)}
        aria-label={`Ação para ${aula.disciplina} ${aula.turma}`}
      >
        <i className={`ti ti-${icon}`} aria-hidden="true" />
      </button>
    </li>
  )
}
