/**
 * StatusBadge — exibe o status de uma aula.
 * Dumb component.
 * Ref: tech-rules.md §2.2 | ui-ux-rules.md §3.2 (cor com propósito semântico)
 *
 * Props:
 *   status {'em_curso'|'encerrada'|'programada'|'nao_definida'}
 */

import styles from './StatusBadge.module.css'

const STATUS_MAP = {
  em_curso:     { label: 'Em curso',    style: 'success' },
  encerrada:    { label: 'Encerrada',   style: 'neutral' },
  programada:   { label: 'Programada',  style: 'warning' },
  nao_definida: { label: 'Não def.',    style: 'muted'   },
}

export function StatusBadge({ status }) {
  const config = STATUS_MAP[status] ?? STATUS_MAP.nao_definida
  return (
    <span className={`${styles.badge} ${styles[config.style]}`}>
      {config.label}
    </span>
  )
}
