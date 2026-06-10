import { Users, Clock3, BookOpen, CircleDot } from 'lucide-react'

export function TeacherClassCard({ turma, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-border-default bg-bg-card p-4 text-left transition hover:border-primary-300 hover:bg-primary-50"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-base font-bold text-text-primary">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: turma.color }}
            />

            {turma.subject}
          </h3>

          <p className="mt-1 text-sm text-text-secondary">
            {turma.name} · {turma.course}
          </p>
        </div>

        {turma.openSessionId ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-50 px-2.5 py-1 text-xs font-semibold text-success-600">
            <CircleDot className="h-4 w-4" />
            Chamada aberta
          </span>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-text-secondary">
        <span className="inline-flex items-center gap-1.5">
          <Clock3 className="h-4 w-4" />
          {turma.schedule}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <Users className="h-4 w-4" />
          {turma.enrolledCount} alunos
        </span>

        <span className="inline-flex items-center gap-1.5">
          <BookOpen className="h-4 w-4" />
          {turma.attendancesDone} chamadas
        </span>
      </div>
    </button>
  )
}