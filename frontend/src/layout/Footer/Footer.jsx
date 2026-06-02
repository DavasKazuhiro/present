// footer simples — só no desktop, no mobile o bottom nav ocupa esse espaço

export function Footer() {
  return (
    <footer className="hidden lg:flex items-center justify-center py-4 text-xs text-neutral-400">
      Present © {new Date().getFullYear()}
    </footer>
  )
}
