import styles from './AttendanceListItem.module.css'

export function AttendanceListItem({ chamada, onMenu }) {
  return (
    <div className={styles.item}>
      <div className={styles.iconWrap} aria-hidden="true">
        <i className="ti ti-book" />
      </div>

      <div className={styles.info}>
        <div className={styles.code}>
          {chamada.codigo}
          <span className={styles.disc}> · {chamada.disciplina}</span>
        </div>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>TURMA</span>
            <span className={styles.metaValue}>{chamada.turma}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>PRESENÇA</span>
            <span className={styles.metaValue}>· {chamada.presenca}%</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>ÚLTIMA CHAMADA</span>
            <span className={styles.metaValue}>{chamada.ultimaChamada}</span>
          </div>
        </div>
      </div>

      <button
        className={styles.menuBtn}
        onClick={() => onMenu?.(chamada)}
        aria-label={`Opções para chamada ${chamada.codigo}`}
      >
        <i className="ti ti-dots-vertical" aria-hidden="true" />
      </button>
    </div>
  )
}
