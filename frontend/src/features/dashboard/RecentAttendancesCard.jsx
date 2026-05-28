import { AttendanceListItem } from './AttendanceListItem'
import styles from './RecentAttendancesCard.module.css'

export function RecentAttendancesCard({ chamadas = [], onMenu }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Últimas Chamadas</h2>
      </div>
      <div className={styles.list}>
        {chamadas.map(chamada => (
          <AttendanceListItem key={chamada.id} chamada={chamada} onMenu={onMenu} />
        ))}
      </div>
    </div>
  )
}
