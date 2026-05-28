import { Chart } from './Chart'
import { DonutLegendItem } from './DonutLegendItem'
import styles from './AttendanceDistributionCard.module.css'

export function AttendanceDistributionCard({ dados, onExport }) {
  if (!dados) return null

  const principal = dados.categorias[0]

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Distribuição de presença</h2>

        <div className={styles.actions}>
          <button className={styles.exportBtn} onClick={onExport} type="button">
            <i className="ti ti-download" aria-hidden="true" />
            Exportar gráfico
          </button>
          <span className={styles.mes}>{dados.mes} ▾</span>
        </div>
      </div>

      <div className={styles.highlight}>
        <strong className={styles.highlightValue}>
          {principal.percentual}% com {principal.label.toLowerCase()}
        </strong>
      </div>

      <div className={styles.body}>
        <Chart categorias={dados.categorias} totalAlunos={dados.totalAlunos} />
        <div className={styles.legend}>
          {dados.categorias.map(cat => (
            <DonutLegendItem
              key={cat.label}
              label={cat.label}
              valor={cat.valor}
              percentual={cat.percentual}
              cor={cat.cor}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
