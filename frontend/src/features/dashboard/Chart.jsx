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
    <div className={styles.wrap}>
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={76}
            dataKey="value"
            strokeWidth={0}
            animationBegin={0}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.cor} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className={styles.center} aria-hidden="true">
        <span className={styles.centerLabel}>Total alunos</span>
        <span className={styles.centerValue}>{totalAlunos}</span>
      </div>
    </div>
  )
}
