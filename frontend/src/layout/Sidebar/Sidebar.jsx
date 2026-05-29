import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',   icon: 'layout-dashboard' },
  { id: 'calendario', label: 'Calendário',  icon: 'calendar' },
  { id: 'turmas',     label: 'Turmas',      icon: 'school' },
]

const BOTTOM_ITEMS = [
  { id: 'configuracoes', label: 'Configurações', icon: 'settings' },
  { id: 'ajustes',       label: 'Ajustes',       icon: 'adjustments-horizontal' },
]

function PresentLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="5.5" stroke="var(--color-primary-600)" strokeWidth="2"/>
      {[0,45,90,135,180,225,270,315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        const x1 = 16 + 10 * Math.sin(rad)
        const y1 = 16 - 10 * Math.cos(rad)
        const x2 = 16 + 14 * Math.sin(rad)
        const y2 = 16 - 14 * Math.cos(rad)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-primary-400)" strokeWidth="2" strokeLinecap="round"/>
      })}
    </svg>
  )
}

export function Sidebar({ activeRoute = 'dashboard', onNavigate }) {
  return (
    <aside className={styles.sidebar} aria-label="Navegação principal">
      <div className={styles.logo}>
        <PresentLogo />
        <span>Present</span>
      </div>

      <nav className={styles.nav} aria-label="Menu principal">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeRoute === item.id ? styles.active : ''}`}
            onClick={() => onNavigate?.(item.id)}
            aria-current={activeRoute === item.id ? 'page' : undefined}
          >
            <i className={`ti ti-${item.icon}`} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={styles.spacer} />
      <div className={styles.divider} />

      <nav className={styles.nav} aria-label="Configurações">
        {BOTTOM_ITEMS.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activeRoute === item.id ? styles.active : ''}`}
            onClick={() => onNavigate?.(item.id)}
          >
            <i className={`ti ti-${item.icon}`} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  )
}