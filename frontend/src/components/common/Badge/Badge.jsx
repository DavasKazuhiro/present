// Badge pra status — tipo "Em curso", "Encerrada", etc
// as cores seguem os tokens semânticos do projeto (success = verde, warning = amarelo...)

const VARIANT_CLASSES = {
  success: 'bg-success-bg text-success-text',
  warning: 'bg-warning-bg text-warning-text',
  danger:  'bg-danger-bg text-danger-text',
  info:    'bg-info-bg text-info-text',
  neutral: 'bg-gray-100 text-text-secondary',
  muted:   'bg-gray-100 text-text-muted border border-border',
}

export default function Badge({ variant = 'neutral', children, className = '' }) {
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.neutral

  return (
    <span
      className={`inline-block text-[10px] font-medium px-2 py-[3px] rounded-full whitespace-nowrap tracking-wide ${variantClass} ${className}`}
    >
      {children}
    </span>
  )
}
