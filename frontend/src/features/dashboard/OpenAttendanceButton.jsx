import styles from './OpenAttendanceButton.module.css'

export function OpenAttendanceButton({ onClick, disabled = false }) {
  return (
    <button
      className={styles.btn}
      onClick={onClick}
      disabled={disabled}
      aria-label="Abrir chamada ativa"
    >
      <i className="ti ti-player-play" aria-hidden="true" />
      Iniciar chamada
    </button>
  )
}
