// layout principal da área logada
// desktop: sidebar à esquerda + conteúdo
// mobile: só conteúdo + bottom nav fixa no rodapé

import { useState } from 'react'
import { LogOut, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Sidebar } from '../Sidebar/Sidebar'
import { BottomNav } from '../BottomNav/BottomNav'
import { getCurrentUser, logout } from '../../services/auth.service'

export function AppLayout({ children, calendar }) {
  const [activeRoute, setActiveRoute] = useState('dashboard')
  const [leaving, setLeaving] = useState(false)
  const navigate = useNavigate()
  const user = getCurrentUser()

  async function handleLogout() {
    setLeaving(true)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F0F2F0] font-sans text-text-primary">
      {/* sidebar — só aparece no desktop (lg+) */}
      <Sidebar activeRoute={activeRoute} onNavigate={setActiveRoute} />

      {/* conteúdo principal — ocupa o resto da tela */}
      <main className="flex-1 min-w-0 overflow-y-auto flex flex-col
        max-lg:pb-16
        [scrollbar-width:thin] [scrollbar-color:#D4D4D4_transparent]">
        {activeRoute === 'configuracoes' ? (
          <div className="flex min-h-full flex-col gap-5 px-7 py-6 pb-12 max-sm:px-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Configurações</h1>
              <p className="mt-1 text-sm text-text-secondary">
                Gerencie sua sessão no Present.
              </p>
            </div>

            <section className="max-w-xl rounded-lg border border-border-default bg-bg-card p-5 shadow-card">
              <div className="flex items-start gap-3">
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                  <Settings className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-text-primary">Conta</h2>
                  <p className="mt-1 truncate text-sm font-semibold text-text-primary">
                    {user?.name ?? 'Usuário'}
                  </p>
                  <p className="truncate text-sm text-text-secondary">{user?.email}</p>
                </div>
              </div>

              <div className="mt-5 border-t border-border-default pt-5">
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={leaving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-danger-100 bg-danger-50 px-4 text-sm font-semibold text-danger-600 transition hover:bg-danger-100 disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  {leaving ? 'Saindo...' : 'Sair'}
                </button>
              </div>
            </section>
          </div>
        ) : activeRoute === 'calendario' && calendar ? (
          <div className="flex min-h-full flex-col gap-5 px-7 py-6 pb-12 max-sm:px-4">
            <div>
              <h1 className="text-3xl font-bold text-text-primary">Calendário semanal</h1>
              <p className="mt-1 text-sm text-text-secondary">
                Grade das matérias cadastradas por dia e horário.
              </p>
            </div>
            {calendar}
          </div>
        ) : (
          children
        )}
      </main>

      {/* bottom nav — só aparece no mobile (abaixo de lg) */}
      <BottomNav activeRoute={activeRoute} onNavigate={setActiveRoute} />
    </div>
  )
}
