import { ClassListItem } from './ClassListItem'
import styles from './TodayClassesCard.module.css'

export function TodayClassesCard({ aulas = [], onAction }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Aulas de hoje</h2>
        <button className={styles.link}>Ver agenda →</button>
      </div>
      <ul className={styles.list}>
        {aulas.map(aula => (
          <ClassListItem key={aula.id} aula={aula} onAction={onAction} />
        ))}
      </ul>
    </div>
  )
}
