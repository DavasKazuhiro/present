import { AttendanceListItem } from './AttendanceListItem'
import styles from './RecentAttendancesCard.module.css'

export function RecentAttendancesCard({ chamadas = [], onMenu }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Últimas chamadas</h2>

        <span className={styles.count}>{chamadas.length} registros</span>
      </div>

      <div className={styles.list} aria-label="Lista das últimas chamadas realizadas">
        {chamadas.map(chamada => (
          <AttendanceListItem key={chamada.id} chamada={chamada} onMenu={onMenu} />
        ))}
      </div>
    </div>
  )
}
