export function Badge({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground ${className}`}>
      {children}
    </span>);

}