// layout principal da área logada
// desktop: sidebar à esquerda + conteúdo
// mobile: só conteúdo + bottom nav fixa no rodapé

import { useState } from 'react'
import { Sidebar } from '../Sidebar/Sidebar'
import { BottomNav } from '../BottomNav/BottomNav'

export function AppLayout({ children }) {
  const [activeRoute, setActiveRoute] = useState('dashboard')

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F0F2F0] font-sans text-text-primary">
      {/* sidebar — só aparece no desktop (lg+) */}
      <Sidebar activeRoute={activeRoute} onNavigate={setActiveRoute} />

      {/* conteúdo principal — ocupa o resto da tela */}
      <main className="flex-1 min-w-0 overflow-y-auto flex flex-col
        max-lg:pb-16
        [scrollbar-width:thin] [scrollbar-color:#D4D4D4_transparent]">
        {children}
      </main>

      {/* bottom nav — só aparece no mobile (abaixo de lg) */}
      <BottomNav activeRoute={activeRoute} onNavigate={setActiveRoute} />
    </div>
  )
}
