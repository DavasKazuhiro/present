// Botão de ícone — recebe o nome do ícone do Tabler (sem o "ti ti-")
// ex: <IconButton icon="bell" onClick={...} />

export default function IconButton({ icon, onClick, ariaLabel, size = 20, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center p-2 rounded-lg
        text-text-secondary hover:text-text-primary hover:bg-neutral-50
        transition-colors cursor-pointer ${className}`}
    >
      <i className={`ti ti-${icon}`} style={{ fontSize: size }} aria-hidden="true" />
    </button>
  )
}
