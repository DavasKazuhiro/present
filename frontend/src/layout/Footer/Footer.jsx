import { Home, GraduationCap, Settings, User } from "lucide-react";
import { useState } from "react";

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "turmas", label: "Turmas", icon: GraduationCap },
  { id: "config", label: "Configurações", icon: Settings },
  { id: "perfil", label: "Perfil", icon: User },
];

export function Footer() {
  const [active, setActive] = useState("turmas");

  return (
    <nav className="fixed bottom-4 left-1/2 z-40 w-[min(92%,640px)] -translate-x-1/2">
      <div className="flex items-center justify-between rounded-2xl border border-border-default bg-primary-100 p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-surface-900 text-white"
                  : "text-black hover:bg-primary-300 hover:text-text-primary"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}