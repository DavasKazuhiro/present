// Card genérico — fundo branco, borda, sombra leve
// aceita className pra quando precisar de algo custom (tipo padding diferente)

export default function Card({ children, className = '', ...rest }) {
  return (
    <div
      className={`bg-bg-card border border-border-default rounded-lg shadow-card ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
