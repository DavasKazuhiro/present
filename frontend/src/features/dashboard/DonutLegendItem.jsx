// item da legenda do gráfico de rosca — bolinha colorida + label + barra de progresso

export function DonutLegendItem({ label, valor, percentual, cor }) {
  return (
    <div className="flex flex-col gap-[5px]">
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0 text-text-primary">
          <span
            className="w-[9px] h-[9px] rounded-full shrink-0"
            style={{ background: cor }}
            aria-hidden="true"
          />
          <span className="text-xs font-semibold truncate">{label}</span>
        </div>
        <div className="flex items-center gap-[5px] shrink-0">
          <span className="text-xs font-extrabold text-text-primary">{valor}</span>
          <span className="text-[11px] font-semibold text-text-secondary">({percentual}%)</span>
        </div>
      </div>

      {/* barrinha de progresso */}
      <div className="w-full h-[5px] overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
        <span
          className="block h-full rounded-[inherit]"
          style={{ width: `${percentual}%`, background: cor }}
        />
      </div>
    </div>
  )
}
