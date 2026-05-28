import styles from './DonutLegendItem.module.css'

export function DonutLegendItem({ label, valor, percentual, cor }) {
  return (
    <div className={styles.item}>
      <div className={styles.line}>
        <div className={styles.left}>
          <span className={styles.dot} style={{ background: cor }} aria-hidden="true" />
          <span className={styles.label}>{label}</span>
        </div>
        <div className={styles.right}>
          <span className={styles.valor}>{valor}</span>
          <span className={styles.pct}>({percentual}%)</span>
        </div>
      </div>

      <div className={styles.track} aria-hidden="true">
        <span
          className={styles.progress}
          style={{ width: `${percentual}%`, background: cor }}
        />
      </div>
    </div>
  )
}
