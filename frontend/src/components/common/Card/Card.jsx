
export function Card({ children, className = "", ...rest }) {
  return (
    <div
      className={`group rounded-2xl border border-gray-200 bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-[var(--shadow-float)] ${className}`}
      {...rest}>
      
      {children}
    </div>);

}