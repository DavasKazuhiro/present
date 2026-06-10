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

export function WeeklyCalendar({ subjects = [], onSubjectClick }) {
  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, index) => START_HOUR + index)
  const today = new Date().getDay()

  const events = subjects.flatMap((subject) =>
    (subject.schedules ?? []).map((schedule) => ({
      ...schedule,
      subject,
      top: ((parseMinutes(schedule.horaInicio) - START_HOUR * 60) / 60) * HOUR_HEIGHT,
      height: Math.max(
        38,
        ((parseMinutes(schedule.horaFim) - parseMinutes(schedule.horaInicio)) / 60) * HOUR_HEIGHT
      ),
    }))
  )

  if (!events.length) {
    return (
      <div className="rounded-lg border border-dashed border-border-default bg-bg-card px-5 py-10 text-center text-sm text-text-secondary">
        Nenhum horário semanal cadastrado ainda.
      </div>
    )
  }

  return (
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
  )
}
