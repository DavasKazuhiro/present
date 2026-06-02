// botão verde de iniciar chamada

export function OpenAttendanceButton({ onClick, disabled = false }) {
  return (
    <button
      className="inline-flex items-center gap-2 bg-success text-white border-none
        rounded-md px-5 py-2.5 text-sm font-medium cursor-pointer
        transition-[background,transform] duration-150
        hover:not-disabled:bg-[#16a34a] active:not-disabled:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
      aria-label="Abrir chamada ativa"
    >
      <i className="ti ti-player-play text-base" aria-hidden="true" />
      Iniciar chamada
    </button>
  )
}
