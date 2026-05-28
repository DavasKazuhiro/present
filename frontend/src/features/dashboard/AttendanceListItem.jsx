import styles from './AttendanceListItem.module.css'

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

export function AttendanceListItem({ chamada, onMenu }) {
  const tone = getAttendanceTone(chamada.presenca)
  const label = getAttendanceLabel(chamada.presenca)

  return (
    <article className={styles.item} aria-label={`Chamada ${chamada.codigo}, ${chamada.disciplina}`}>
      <div className={styles.iconWrap} aria-hidden="true">
        <i className="ti ti-clipboard-check" />
      </div>

      <div className={styles.info}>
        <div className={styles.topLine}>
          <div className={styles.titleGroup}>
            <span className={styles.code}>{chamada.codigo}</span>
            <strong className={styles.disc}>{chamada.disciplina}</strong>
          </div>

          <span className={`${styles.presenceBadge} ${styles[tone]}`}>
            {chamada.presenca}% · {label}
          </span>
        </div>

        <div className={styles.meta}>
          <span>Turma {chamada.turma}</span>
          <span aria-hidden="true">•</span>
          <span>Última chamada em {chamada.ultimaChamada}</span>
        </div>
      </div>

      <button
        className={styles.menuBtn}
        onClick={() => onMenu?.(chamada)}
        aria-label={`Abrir opções da chamada ${chamada.codigo}`}
        type="button"
      >
        <i className="ti ti-dots-vertical" aria-hidden="true" />
      </button>
    </article>
  )
}
