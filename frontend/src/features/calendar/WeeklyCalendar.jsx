import { useState } from 'react'
import { Footer } from '../../layout/Footer/Footer'

const DAYS = [
  { index: 1, label: 'Seg' },
  { index: 2, label: 'Ter' },
  { index: 3, label: 'Qua' },
  { index: 4, label: 'Qui' },
  { index: 5, label: 'Sex' },
  { index: 6, label: 'Sáb' },
]

const START_HOUR = 6
const END_HOUR = 23
const HOUR_HEIGHT = 60

function parseMinutes(time) {
  const [hour, minute] = String(time).split(':').map(Number)
  return hour * 60 + minute
}

function alphaColor(hex, alpha = '22') {
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex ?? '')) return `#2563eb${alpha}`
  return `${hex}${alpha}`
}

const TURNOS = {
  todos: { label: 'Todos',  start: 6,  end: 24 },
  manha: { label: 'Manhã',  start: 6,  end: 12 },
  tarde: { label: 'Tarde',  start: 12, end: 18 },
  noite: { label: 'Noite',  start: 18, end: 24 },
}

export function WeeklyCalendar({ subjects = [], onSubjectClick }) {
  const [turno, setTurno] = useState('todos')
  const { start, end } = TURNOS[turno]

  const hours = Array.from({ length: end - start }, (_, i) => start + i)
  const today = new Date().getDay()

  const events = subjects
    .flatMap((subject) =>
      (subject.schedules ?? []).map((schedule) => ({
        ...schedule, subject,
        top: ((parseMinutes(schedule.horaInicio) - start * 60) / 60) * HOUR_HEIGHT,
        height: Math.max(32, ((parseMinutes(schedule.horaFim) - parseMinutes(schedule.horaInicio)) / 60) * HOUR_HEIGHT),
      }))
    )
    .filter((e) => {
      const h = Math.floor(parseMinutes(e.horaInicio) / 60)
      return h >= start && h < end
    })

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <label className="text-sm text-text-secondary">Turno:</label>
        <select
          value={turno}
          onChange={(e) => setTurno(e.target.value)}
          className="rounded-md border border-border-default px-2 py-1 text-sm"
        >
          {Object.entries(TURNOS).map(([key, { label }]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
        <div className="overflow-hidden rounded-lg border border-border-default bg-bg-card shadow-card">
        <div className="overflow-auto">
          <div className="min-w-[760px]">
            <div className="grid grid-cols-[64px_repeat(6,1fr)] border-b border-border-default bg-neutral-50">
              <div className="px-3 py-3 text-xs font-semibold text-text-secondary">Hora</div>
              {DAYS.map((day) => (
                <div
                  key={day.index}
                  className={`px-3 py-3 text-center text-xs font-bold uppercase tracking-wide ${
                    today === day.index ? 'text-primary-700' : 'text-text-secondary'
                  }`}
                >
                  {day.label}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-[64px_repeat(6,1fr)]">
              <div>
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-[60px] border-b border-border-default px-2 py-1 text-right text-[11px] text-text-secondary"
                  >
                    {String(hour).padStart(2, '0')}h
                  </div>
                ))}
              </div>

              {DAYS.map((day) => (
                <div key={day.index} className="relative border-l border-border-default">
                  {hours.map((hour) => (
                    <div key={hour} className="h-[60px] border-b border-border-default" />
                  ))}

                  {events
                    .filter((event) => Number(event.diaSemana) === day.index)
                    .map((event) => (
                      <button
                        key={`${event.subject.id}-${event.id}`}
                        type="button"
                        onClick={() => onSubjectClick?.(event.subject)}
                        className="absolute left-2 right-2 overflow-hidden rounded-md border-l-[3px] px-2 py-1 text-left shadow-sm transition hover:scale-[1.01]"
                        style={{
                          top: `${Math.max(0, event.top)}px`,
                          height: `${event.height}px`,
                          borderLeftColor: event.subject.color,
                          backgroundColor: alphaColor(event.subject.color),
                        }}
                      >
                        <span className="block truncate text-xs font-bold text-text-primary">
                          {event.subject.subject}
                        </span>
                        <span className="block truncate text-[11px] text-text-secondary">
                          {event.subject.name}
                        </span>
                        <span className="mt-1 block text-[11px] font-semibold text-text-primary">
                          {event.horaInicio}-{event.horaFim}
                        </span>
                        {event.subject.activeSession ? (
                          <span className="mt-1 inline-block rounded-full bg-success-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                            Chamada aberta
                          </span>
                        ) : null}
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>  
  )
}