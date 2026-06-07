import AttendanceRow from './AttendanceRow'

export default function AttendanceList({ items, total, onBaixar, onAbrir, onVerTodas }) {
  if (items.length === 0) {
    return (
      <section>
        <h2 className="mb-4 text-3xl font-bold text-text-primary max-sm:text-2xl">Chamadas realizadas</h2>
        <div className="rounded-2xl border border-border-default bg-bg-card px-5 py-12 text-center text-sm text-text-secondary shadow-card">
          Nenhuma chamada realizada ainda. Clique em <strong className="font-semibold text-text-primary">Abrir chamada</strong> para registrar a primeira.
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="text-3xl font-bold text-text-primary max-sm:text-2xl">Chamadas realizadas</h2>
        <p className="text-right text-sm text-text-muted max-sm:hidden">
          {total} chamadas no semestre · mais recentes primeiro
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border-default bg-bg-card shadow-card">
        <ul className="divide-y divide-border-default">
          {items.map((item) => (
            <AttendanceRow key={item.id} item={item} onBaixar={onBaixar} onAbrir={onAbrir} />
          ))}
        </ul>

        {total > items.length && (
          <button
            type="button"
            onClick={onVerTodas}
            className="w-full border-t border-border-default py-4 text-center text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
          >
            Ver todas as {total} chamadas →
          </button>
        )}
      </div>
    </section>
  )
}