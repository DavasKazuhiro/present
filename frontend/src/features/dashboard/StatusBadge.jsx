// wrapper do Badge genérico pro contexto de status de aula
// mapeia os status do back pro componente Badge

import Badge from '../../components/common/Badge/Badge'

const STATUS_MAP = {
  em_curso:     { label: 'Em curso',   variant: 'success' },
  encerrada:    { label: 'Encerrada',  variant: 'neutral' },
  programada:   { label: 'Programada', variant: 'warning' },
  nao_definida: { label: 'Não def.',   variant: 'muted'   },
}

export function StatusBadge({ status }) {
  const config = STATUS_MAP[status] ?? STATUS_MAP.nao_definida
  return <Badge variant={config.variant}>{config.label}</Badge>
}
