import styles from './MetricCard.module.css'

export function MetricCard({ icon, value, label, delta, deltaType = 'positive', darkIcon = false }) {
  return (
    <div className={styles.card}>
      <div className={`${styles.iconWrap} ${darkIcon ? styles.iconDark : styles.iconLight}`}>
        <i className={`ti ti-${icon}`} aria-hidden="true" />
      </div>
      <div className={styles.content}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
        {delta && (
          <span className={`${styles.delta} ${styles[deltaType]}`}>{delta}</span>
        )}
      </div>
    </div>
  )
}
