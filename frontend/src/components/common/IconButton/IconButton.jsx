
export function IconButton({ children, variant = "solid", className = "", ...rest }) {
  const base = "inline-flex h-11 w-11 items-center justify-center rounded-full transition-all active:scale-95";
  const styles = variant === "solid" ?
  "bg-primary text-primary-foreground shadow-[var(--shadow-float)] hover:brightness-110" :
  "text-foreground hover:bg-muted";
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>);

}