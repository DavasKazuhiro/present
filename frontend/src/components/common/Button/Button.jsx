// Botão padrão da aplicação.
// 3 variantes: primary (azul), secondary (escuro), ghost (só texto).

// Classes Tailwind base — aplicadas em todas as variantes
const baseClasses =
  'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

// Classes específicas de cada variante
const variantClasses = {
  primary: 'bg-cyan-400 text-slate-900 hover:bg-cyan-300',
  secondary: 'bg-slate-900 text-white hover:bg-slate-800',
  ghost: 'bg-transparent text-slate-700 hover:text-slate-900',
}

export default function Button({ variant = 'primary', children, ...rest }) {
  const classes = `${baseClasses} ${variantClasses[variant]}`

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  )
}