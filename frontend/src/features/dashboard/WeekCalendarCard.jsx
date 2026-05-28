import { WeekCalendarChip } from './WeekCalendarChip'
import styles from './WeekCalendarCard.module.css'

const DIAS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX']
const DATAS = ['04', '05', '06', '07', '08']
const HORAS = ['08h', '10h', '14h', '16h']

export function WeekCalendarCard({ eventos = [], diaAtual = 3 }) {
  const getEvento = (dia, hora) =>
    eventos.find(e => e.dia === dia && e.hora === hora)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Agenda semanal</h2>

        <span className={styles.range} aria-label="Período exibido: 04 a 10 de maio">
          04 — 10 Mai
          <i className="ti ti-chevron-right" aria-hidden="true" />
        </span>
      </div>

      <div className={styles.grid} role="table" aria-label="Calendário de aulas da semana">
        <div className={styles.timeGutter} />
        {DIAS.map((dia, i) => (
          <div
            key={dia}
            className={`${styles.dayHeader} ${i === diaAtual ? styles.today : ''}`}
            role="columnheader"
          >
            <span className={styles.dayName}>{dia}</span>
            <span className={styles.dayNum}>{DATAS[i]}</span>
          </div>
        ))}

        {HORAS.map(hora => (
          <div className={styles.rowGroup} key={hora} role="row">
            <div className={styles.timeLabel}>{hora}</div>
            {DIAS.map((_, diaIdx) => {
              const evento = getEvento(diaIdx, hora)
              return (
                <div key={`${diaIdx}-${hora}`} className={styles.cell} role="cell">
                  {evento && (
                    <WeekCalendarChip label={evento.label} status={evento.status} />
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className={styles.legend} aria-label="Legenda dos status da semana">
        <div className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotProg}`} />
          Programada
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotEnc}`} />
          Encerrada
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotCurso}`} />
          Em curso
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.dot} ${styles.dotNdef}`} />
          Não def.
        </div>
      </div>
    </div>
  )
}
