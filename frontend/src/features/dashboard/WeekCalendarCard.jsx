// card "Agenda semanal" — grid de dias × horários com chips de evento

import { WeekCalendarChip } from './WeekCalendarChip'

const DIAS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX']
const DATAS = ['04', '05', '06', '07', '08']
const HORAS = ['08h', '10h', '14h', '16h']

export function WeekCalendarCard({ eventos = [], diaAtual = 3 }) {
  // acha o evento pra uma posição específica do grid
  const getEvento = (dia, hora) =>
    eventos.find(e => e.dia === dia && e.hora === hora)

  return (
    <div className="h-full bg-neutral-0 border border-border-default rounded-lg px-[22px] py-5 shadow-card">
      {/* header */}
      <div className="flex items-center justify-between gap-4 mb-3.5">
        <h2 className="m-0 text-[13px] font-semibold text-neutral-800 tracking-[0.01em]">
          Agenda semanal
        </h2>
        <span
          className="inline-flex items-center gap-1 text-action-primary text-[13px] font-medium
            whitespace-nowrap px-2 py-[3px] rounded-full bg-[rgba(219,234,254,0.55)]"
          aria-label="Período exibido: 04 a 10 de maio"
        >
          04 — 10 Mai
          <i className="ti ti-chevron-right" aria-hidden="true" />
        </span>
      </div>

      {/* grid: coluna de horas + 5 dias */}
      <div
        className="grid grid-cols-[42px_repeat(5,minmax(0,1fr))] gap-x-2"
        role="table"
        aria-label="Calendário de aulas da semana"
      >
        {/* canto superior esquerdo vazio */}
        <div className="col-span-1" />

        {/* headers dos dias */}
        {DIAS.map((dia, i) => (
          <div
            key={dia}
            className={`min-h-[38px] flex flex-col items-center justify-center gap-0.5 rounded-md
              ${i === diaAtual
                ? 'bg-[rgba(240,253,247,0.76)] text-success-600 shadow-[inset_0_0_0_1px_rgba(42,168,126,0.18)]'
                : 'text-neutral-500'
              }`}
            role="columnheader"
          >
            <span className="text-[10px] font-bold leading-none">{dia}</span>
            <span className="text-[11px] font-bold leading-none">{DATAS[i]}</span>
          </div>
        ))}

        {/* linhas de horário */}
        {HORAS.map(hora => (
          <div className="contents" key={hora} role="row">
            {/* label do horário */}
            <div className="flex justify-end items-start min-h-[42px] pt-[9px] pr-[7px]
              border-t border-border-default text-[10px] font-medium text-neutral-400 leading-snug">
              {hora}
            </div>

            {/* células dos dias */}
            {DIAS.map((_, diaIdx) => {
              const evento = getEvento(diaIdx, hora)
              return (
                <div key={`${diaIdx}-${hora}`} className="min-h-[42px] py-[5px] border-t border-border-default overflow-hidden" role="cell">
                  {evento && (
                    <WeekCalendarChip label={evento.label} status={evento.status} />
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* legenda */}
      <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-border-default flex-wrap" aria-label="Legenda dos status da semana">
        <div className="inline-flex items-center gap-[5px] text-[10px] font-medium text-neutral-500">
          <span className="w-[7px] h-[7px] rounded-full bg-[#bfdbfe] shrink-0" />
          Programada
        </div>
        <div className="inline-flex items-center gap-[5px] text-[10px] font-medium text-neutral-500">
          <span className="w-[7px] h-[7px] rounded-full bg-sidebar-bg shrink-0" />
          Encerrada
        </div>
        <div className="inline-flex items-center gap-[5px] text-[10px] font-medium text-neutral-500">
          <span className="w-[7px] h-[7px] rounded-full bg-success shrink-0" />
          Em curso
        </div>
        <div className="inline-flex items-center gap-[5px] text-[10px] font-medium text-neutral-500">
          <span className="w-[7px] h-[7px] rounded-full bg-gray-100 border border-dashed border-[#aaa] shrink-0" />
          Não def.
        </div>
      </div>
    </div>
  )
}
