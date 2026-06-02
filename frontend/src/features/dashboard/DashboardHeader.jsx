// header do dashboard — saudação + data/hora + botão de notificação

export function DashboardHeader({ professorName, dataHora, onNotification }) {
  return (
    <div className="flex items-end justify-between px-7 pt-7 pb-5
      border-b border-border-default bg-[#F0F2F0] sticky top-0 z-10 backdrop-blur-sm">
      <div>
        <p className="text-[11px] font-medium text-neutral-400 tracking-wider uppercase mb-1">
          {dataHora}
        </p>
        <h1 className="text-[28px] font-bold text-neutral-900 leading-tight tracking-tight">
          Bom dia, {professorName}.
        </h1>
      </div>

      <button
        className="bg-neutral-0 border border-border-default rounded-full w-[42px] h-[42px]
          flex items-center justify-center cursor-pointer text-lg text-neutral-500
          shadow-card shrink-0 transition-colors duration-150
          hover:bg-neutral-50 hover:border-border-strong hover:text-neutral-700"
        onClick={onNotification}
        aria-label="Notificações"
      >
        <i className="ti ti-bell" aria-hidden="true" />
      </button>
    </div>
  )
}
