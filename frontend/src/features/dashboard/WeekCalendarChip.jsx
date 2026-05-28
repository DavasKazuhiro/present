import styles from './WeekCalendarChip.module.css'

const STATUS_LABELS = {
  em_curso: 'Em curso',
  encerrada: 'Encerrada',
  programada: 'Programada',
  nao_definida: 'Não definida',
}

export function WeekCalendarChip({ label, status }) {
  return (
    <div
      className={`${styles.chip} ${styles[status]}`}
      title={`${label} · ${STATUS_LABELS[status] ?? 'Status'}`}
      aria-label={`${label}. Status: ${STATUS_LABELS[status] ?? 'não informado'}`}
    >
      <span className={styles.statusMark} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  )
}
