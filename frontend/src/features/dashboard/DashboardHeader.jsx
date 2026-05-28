import styles from './DashboardHeader.module.css'

export function DashboardHeader({ professorName, dataHora, onNotification }) {
  return (
    <div className={styles.header}>
      <div>
        <p className={styles.date}>{dataHora}</p>
        <h1 className={styles.greeting}>Bom dia, {professorName}.</h1>
      </div>
      <button
        className={styles.bellBtn}
        onClick={onNotification}
        aria-label="Notificações"
      >
        <i className="ti ti-bell" aria-hidden="true" />
      </button>
    </div>
  )
}
