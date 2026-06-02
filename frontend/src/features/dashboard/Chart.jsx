// gráfico de rosca (donut) — usa recharts
// mostra a distribuição de presença com tooltip customizado

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="bg-bg-card border border-border rounded-md px-2.5 py-[7px]
      flex flex-col gap-0.5 shadow-[0_8px_20px_rgba(17,24,39,0.12)]">
      <span className="text-[11px] font-semibold text-text-secondary">{name}</span>
      <span className="text-[13px] font-extrabold text-text-primary">{value} alunos</span>
    </div>
  )
}

export function Chart({ categorias = [], totalAlunos }) {
  const data = categorias.map(c => ({ name: c.label, value: c.valor, cor: c.cor }))

  return (
    <div
      className="relative w-[178px] h-[178px] shrink-0"
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

      {/* texto no centro da rosca */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" aria-hidden="true">
        <span className="block text-[10px] font-bold text-text-secondary leading-tight">Total</span>
        <span className="block text-[26px] font-extrabold text-text-primary tracking-tighter leading-none">
          {totalAlunos}
        </span>
        <span className="block mt-px text-[10px] font-semibold text-text-muted leading-tight">alunos</span>
      </div>
    </div>
  )
}
