// card "Últimas chamadas" — lista das chamadas recentes com % de presença

import { AttendanceListItem } from './AttendanceListItem'

export function RecentAttendancesCard({ chamadas = [], onMenu }) {
  return (
    <div className="h-full bg-neutral-0 border border-border-default rounded-lg px-[22px] py-5 shadow-card">
      <div className="flex items-center justify-between gap-4 mb-3.5">
        <h2 className="m-0 text-[13px] font-semibold text-neutral-800 tracking-[0.01em]">
          Últimas chamadas
        </h2>
        <span className="px-2 py-[3px] rounded-full bg-gray-100 text-neutral-500
          text-[10px] font-semibold whitespace-nowrap">
          {chamadas.length} registros
        </span>
      </div>

      <div className="flex flex-col" aria-label="Lista das últimas chamadas realizadas">
        {chamadas.map(chamada => (
          <AttendanceListItem key={chamada.id} chamada={chamada} onMenu={onMenu} />
        ))}
      </div>
    </div>
  )
}
