// card "Distribuição de presença" — donut chart + legenda

import { Chart } from './Chart'
import { DonutLegendItem } from './DonutLegendItem'

export function AttendanceDistributionCard({ dados, onExport }) {
  if (!dados) return null

  const principal = dados.categorias[0]

  return (
    <div className="bg-bg-card border border-border rounded-lg px-[22px] py-5 shadow-card">
      {/* header com título + ações */}
      <div className="flex items-center justify-between gap-4 mb-3.5">
        <h2 className="m-0 text-[13px] font-semibold text-neutral-800 tracking-[0.01em]">
          Distribuição de presença
        </h2>

        <div className="flex items-center gap-2 shrink-0">
          <button
            className="inline-flex items-center gap-1.5 bg-transparent text-neutral-800
              border-none rounded-full px-1.5 py-1 text-[13px] font-medium tracking-[0.01em]
              cursor-pointer transition-colors duration-150
              hover:bg-gray-100 hover:text-text-primary
              focus-visible:outline-2 focus-visible:outline-success focus-visible:outline-offset-2"
            onClick={onExport}
            type="button"
          >
            <i className="ti ti-download" aria-hidden="true" />
            Exportar gráfico
          </button>

          <span className="inline-flex items-center h-7 px-2.5 rounded-full bg-gray-100
            text-neutral-800 text-[13px] font-medium tracking-[0.01em] whitespace-nowrap">
            {dados.mes} ▾
          </span>
        </div>
      </div>

      {/* destaque — ex: "72% com presença regular" */}
      <div className="flex justify-end mb-4 text-neutral-800">
        <strong className="text-[13px] font-semibold tracking-[0.01em] text-right">
          {principal.percentual}% com {principal.label.toLowerCase()}
        </strong>
      </div>

      {/* gráfico + legenda lado a lado */}
      <div className="flex items-center gap-7">
        <Chart categorias={dados.categorias} totalAlunos={dados.totalAlunos} />
        <div className="flex-1 min-w-0 flex flex-col gap-2.5">
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
