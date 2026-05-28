import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import styles from './Chart.module.css'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className={styles.tooltip}>
      <span className={styles.tooltipLabel}>{name}</span>
      <span className={styles.tooltipValue}>{value} alunos</span>
    </div>
  )
}

export function Chart({ categorias = [], totalAlunos }) {
  const data = categorias.map(c => ({ name: c.label, value: c.valor, cor: c.cor }))

  return (
    <div
      className={styles.wrap}
      role="img"
      aria-label={`Gráfico de distribuição de presença com ${totalAlunos} alunos no total`}
    >
      <ResponsiveContainer width={178} height={178}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={58}
            outerRadius={84}
            dataKey="value"
            strokeWidth={0}
            animationBegin={0}
            animationDuration={650}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.cor} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className={styles.center} aria-hidden="true">
        <span className={styles.centerLabel}>Total</span>
        <span className={styles.centerValue}>{totalAlunos}</span>
        <span className={styles.centerSub}>alunos</span>
      </div>
    </div>
  )
}
