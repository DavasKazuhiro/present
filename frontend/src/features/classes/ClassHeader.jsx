function Meta({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-primary-200">{label}</span>
      <span className="text-base font-semibold text-neutral-0">{value}</span>
    </div>
  )
}

export default function ClassHeader({ info, role }) {
  const isTeacher = role === "teacher"

  return (
    <section className="rounded-2xl bg-primary-800 px-7 py-6 max-sm:px-5 max-sm:py-5">
      <div className="flex items-start justify-between gap-6 max-sm:flex-col max-sm:gap-5">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-primary-300">
            {info.code} · {info.section}
          </p>

          <h1 className="mt-1 text-4xl font-bold leading-tight text-neutral-0 max-sm:text-3xl">
            {info.name}
          </h1>

          <div className="mt-5 grid grid-cols-4 gap-6 max-md:grid-cols-2">
            <Meta label="Horário" value={info.schedule} />
            <Meta label="Sala" value={info.room} />
            {isTeacher && (
              <Meta label="Alunos" value={`${info.enrolledCount} matriculados`} />
            )}
            <Meta label="Chamadas no semestre" value={`${info.attendancesDone} realizadas`} />
          </div>
        </div>

        {isTeacher && (
          <div className="flex flex-col items-end border-l border-primary-600 pl-6 max-sm:items-start max-sm:border-l-0 max-sm:border-t max-sm:pl-0 max-sm:pt-4">
            <span className="text-xs font-medium text-primary-200">Frequência da turma</span>
            <p className="mt-1 text-5xl font-bold leading-none text-neutral-0">
              {info.semesterRate}
              <span className="text-2xl font-semibold text-primary-300">%</span>
            </p>
            <span className="mt-1 text-xs text-primary-200">média semestral</span>
          </div>
        )}

        {!isTeacher && (
          <div className="flex flex-col items-end border-l border-primary-600 pl-6 max-sm:items-start max-sm:border-l-0 max-sm:border-t max-sm:pl-0 max-sm:pt-4">
            <span className="text-xs font-medium text-primary-200">Minha frequência</span>
            <p className="mt-1 text-5xl font-bold leading-none text-neutral-0">
              {info.studentRate}
              <span className="text-2xl font-semibold text-primary-300">%</span>
            </p>
            <span className="mt-1 text-xs text-primary-200">no semestre</span>
          </div>
        )}
      </div>
    </section>
  )
}