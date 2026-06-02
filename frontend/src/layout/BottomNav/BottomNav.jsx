// barra de navegação fixa no rodapé, só aparece no mobile (abaixo de lg)
// substitui a sidebar quando a tela é pequena

const NAV_ITEMS = [
  { id: 'dashboard',     label: 'Home',      icon: 'layout-dashboard' },
  { id: 'turmas',        label: 'Turmas',    icon: 'school' },
  { id: 'calendario',    label: 'Agenda',    icon: 'calendar' },
  { id: 'configuracoes', label: 'Config',    icon: 'settings' },
]

export function BottomNav({ activeRoute = 'dashboard', onNavigate }) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-neutral-0 border-t border-border-default
        flex items-center justify-around py-2 px-1
        lg:hidden"
      aria-label="Navegação principal"
    >
      {NAV_ITEMS.map(item => {
        const isActive = activeRoute === item.id
        return (
          <button
            key={item.id}
            onClick={() => onNavigate?.(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg
              border-none cursor-pointer bg-transparent transition-colors duration-150
              ${isActive
                ? 'text-primary-600'
                : 'text-neutral-400 hover:text-neutral-600'
              }`}
            aria-current={isActive ? 'page' : undefined}
          >
            <i className={`ti ti-${item.icon} text-xl`} aria-hidden="true" />
            <span className="text-[10px] font-medium leading-none">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
