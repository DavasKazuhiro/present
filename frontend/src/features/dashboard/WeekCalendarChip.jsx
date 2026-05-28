import styles from './WeekCalendarChip.module.css'

export function WeekCalendarChip({ label, status }) {
  return (
    <div className={`${styles.chip} ${styles[status]}`}>
      {label}
    </div>
  )
}
