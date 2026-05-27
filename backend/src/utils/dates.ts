export function toMysqlDateTime(date = new Date()): string {
  return date.toISOString().slice(0, 19).replace('T', ' ')
}
