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
        <h2 className={styles.title}>Esta semana</h2>
        <span className={styles.range}>04 — 10 Mai →</span>
      </div>

      <div className={styles.grid}>
        <div className={styles.timeGutter} />
        {DIAS.map((dia, i) => (
          <div
            key={dia}
            className={`${styles.dayHeader} ${i === diaAtual ? styles.today : ''}`}
          >
            <span className={styles.dayName}>{dia}</span>
            <span className={styles.dayNum}>{DATAS[i]}</span>
          </div>
        ))}

        {HORAS.map(hora => (
          <>
            <div key={`h-${hora}`} className={styles.timeLabel}>{hora}</div>
            {DIAS.map((_, diaIdx) => {
              const evento = getEvento(diaIdx, hora)
              return (
                <div key={`${diaIdx}-${hora}`} className={styles.cell}>
                  {evento && (
                    <WeekCalendarChip label={evento.label} status={evento.status} />
                  )}
                </div>
              )
            })}
          </>
        ))}
      </div>

      <div className={styles.legend}>
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
