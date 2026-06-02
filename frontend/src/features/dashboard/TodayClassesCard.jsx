// card "Aulas de hoje" — lista das aulas do dia

import { ClassListItem } from './ClassListItem'

export function TodayClassesCard({ aulas = [], onAction }) {
  return (
    <div className="bg-neutral-0 border border-border-default rounded-lg px-[22px] py-5 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[13px] font-semibold text-neutral-800 tracking-[0.01em]">
          Aulas de hoje
        </h2>
        <button className="bg-transparent border-none cursor-pointer text-xs font-medium
          text-action-primary p-0 transition-opacity hover:opacity-75">
          Ver agenda →
        </button>
      </div>

      <ul className="p-0 m-0 flex flex-col">
        {aulas.map(aula => (
          <ClassListItem key={aula.id} aula={aula} onAction={onAction} />
        ))}
      </ul>
    </div>
  )
}
