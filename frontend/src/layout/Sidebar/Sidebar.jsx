// sidebar do professor, visível só no desktop (lg pra cima)
// no mobile a navegação vai pro BottomNav

import Logo from '../../components/common/Logo/Logo'

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',   icon: 'fa-solid fa-chart-pie' },
  { id: 'calendario', label: 'Calendário',  icon: 'fa-solid fa-calendar-days' },
]

const BOTTOM_ITEMS = [
  { id: 'configuracoes', label: 'Configurações', icon: 'fa-solid fa-gear' },
]

export function Sidebar({ activeRoute = 'dashboard', onNavigate }) {
  return (
    <aside
      className="hidden lg:flex w-[220px] min-w-[220px] h-screen bg-primary-50
        flex-col py-7 px-4 gap-0.5 overflow-hidden relative"
      aria-label="Navegação principal"
    >
      {/* borda sutil à direita */}
      <div className="absolute right-0 top-0 bottom-0 w-px
        bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />

      {/* logo */}
      <div className="flex items-center gap-2.5 text-primary-600 text-xl font-semibold mb-8 px-2 tracking-tight">
        <Logo size={26} />
        <span>Present</span>
      </div>

      {/* nav principal */}
      <nav className="flex flex-col gap-0.5" aria-label="Menu principal">
        {NAV_ITEMS.map(item => (
          <SidebarItem
            key={item.id}
            item={item}
            active={activeRoute === item.id}
            onClick={() => onNavigate?.(item.id)}
          />
        ))}
      </nav>

      {/* empurra as configs pra baixo */}
      <div className="flex-1 min-h-6" />

      {/* divisor */}
      <div className="h-px bg-white/[0.07] mx-3 my-2" />

      {/* nav de configurações */}
      <nav className="flex flex-col gap-0.5" aria-label="Configurações">
        {BOTTOM_ITEMS.map(item => (
          <SidebarItem
            key={item.id}
            item={item}
            active={activeRoute === item.id}
            onClick={() => onNavigate?.(item.id)}
          />
        ))}
      </nav>
    </aside>
  )
}

// item individual da sidebar — separei pra não repetir a mesma lógica
function SidebarItem({ item, active, onClick }) {
  return (
    <button
      className={`flex items-center gap-2.5 py-[9px] px-3 rounded-md text-[15px]
        w-full text-left border-none cursor-pointer relative
        transition-colors duration-150
        ${active
          ? 'bg-white/[0.11] text-primary-600 font-medium'
          : 'bg-transparent text-primary-600 font-normal hover:bg-white/[0.07] hover:text-primary-400'
        }`}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
    >
      {/* barrinha verde do item ativo */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px]
          bg-primary-400 rounded-r-sm" />
      )}

      <i
        className={`${item.icon} text-[17px] shrink-0
          ${active ? 'opacity-100 text-primary-300' : 'opacity-85'}`}
        aria-hidden="true"
      />
      <span>{item.label}</span>
    </button>
  )
}
