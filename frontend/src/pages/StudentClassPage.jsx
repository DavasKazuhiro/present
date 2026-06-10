import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Clock3, CheckCircle2, XCircle } from 'lucide-react'

import { AppLayout } from '../layout/AppLayout/AppLayout'
import ClassHeader from '../features/classes/ClassHeader'

import {
  getClassAttendances,
  getStudentClass,
} from '../services/classes.service'

export default function StudentClassPage() {
  const { id } = useParams()
  const turmaId = Number(id)

  const navigate = useNavigate()

  const [turma, setTurma] = useState(null)
  const [attendances, setAttendances] = useState([])

  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  async function loadClass() {
    setMessage('')

    try {
      const [classData, classAttendances] = await Promise.all([
        getStudentClass(turmaId),
        getClassAttendances(turmaId),
      ])

      setTurma(classData)
      setAttendances(classAttendances)
    } catch {
      setMessage('Não foi possível carregar esta matéria.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (turmaId) {
      loadClass()
    }
  }, [turmaId])

  const activeAttendance = attendances.find(
    (attendance) => attendance.isOpen
  )

  if (loading) {
    return (
      <AppLayout>
        <div className="px-7 py-12 text-sm text-text-secondary">
          Carregando matéria...
        </div>
      </AppLayout>
    )
  }

  if (!turma) {
    return (
      <AppLayout>
        <div className="flex flex-col gap-3 px-7 py-12">
          <p className="text-sm font-semibold text-danger-600">
            {message || 'Matéria não encontrada.'}
          </p>

          <button
            type="button"
            onClick={() => navigate('/dashboard/student')}
            className="w-fit rounded-lg border border-border-default px-4 py-2 text-sm font-semibold"
          >
            Voltar
          </button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 px-7 py-6 pb-12 max-sm:px-4">

        <nav className="flex items-center gap-2 text-sm">
          <button
            type="button"
            onClick={() => navigate('/dashboard/student')}
            aria-label="Voltar para Matérias"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border-default text-text-secondary transition hover:bg-neutral-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="text-text-secondary">Matérias</span>

          <span className="text-text-muted">/</span>

          <span className="font-semibold text-text-primary">
            {turma.name} · {turma.section}
          </span>
        </nav>

        {message && (
          <div className="rounded-lg border border-danger-100 bg-danger-50 px-4 py-3 text-sm font-semibold text-danger-600">
            {message}
          </div>
        )}

        <ClassHeader info={turma} />

        {/* Painel de chamada ativa */}
        {activeAttendance ? (
          <section className="rounded-lg border border-success-200 bg-success-50 p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-100">
                <Clock3 className="h-6 w-6 text-success-700" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-success-800">
                  Chamada em andamento
                </h2>

                <p className="text-sm text-success-700">
                  {activeAttendance.title}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-lg border border-border-default bg-bg-card p-5 shadow-card">
            <h2 className="text-lg font-bold text-text-primary">
              Nenhuma chamada ativa
            </h2>

            <p className="mt-1 text-sm text-text-secondary">
              Não há chamadas ocorrendo neste momento.
            </p>
          </section>
        )}

        {/* Histórico */}
        <section className="rounded-lg border border-border-default bg-bg-card p-5 shadow-card">

          <div className="mb-5">
            <h2 className="text-xl font-bold text-text-primary">
              Chamadas anteriores
            </h2>

            <p className="text-sm text-text-secondary">
              Histórico das suas presenças nesta matéria.
            </p>
          </div>

          {attendances.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border-default px-4 py-8 text-center text-sm text-text-secondary">
              Nenhuma chamada encontrada.
            </div>
          ) : (
            <div className="flex flex-col gap-3">

              {attendances.map((attendance) => {
                const responded = attendance.responded

                return (
                  <div
                    key={attendance.id}
                    className="flex items-center justify-between rounded-lg border border-border-default px-4 py-4"
                  >

                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">
                        {attendance.title}
                      </h3>

                      <p className="mt-1 text-xs text-text-secondary">
                        {new Date(attendance.createdAt).toLocaleDateString(
                          'pt-BR'
                        )}
                      </p>
                    </div>

                    <div
                      className={`
                        inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold
                        ${
                          responded
                            ? 'bg-success-100 text-success-700'
                            : 'bg-danger-100 text-danger-700'
                        }
                      `}
                    >
                      {responded ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Respondida
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          Não respondida
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  )
}