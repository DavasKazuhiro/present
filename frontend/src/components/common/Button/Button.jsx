// Botão padrão — 3 variantes: primary (verde), secondary (escuro), ghost (só texto)

const baseClasses =
  'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

const variantClasses = {
  primary:   'bg-primary-300 text-white hover:bg-primary-400',
  secondary: 'bg-primary-900 text-white hover:bg-primary-800',
  ghost:     'bg-transparent text-neutral-700 hover:text-neutral-900',
}

export default function Button({ variant = 'primary', children, className = '', ...rest }) {
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}