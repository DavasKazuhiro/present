import { useEffect, useState } from 'react'
import { Users, SquareX } from 'lucide-react'

// formata segundos -> "MM:SS"
function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const s = String(totalSeconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

export default function LiveAttendanceModal({ open, attendance, turma, onClose }) {
  // duração vem em minutos; guardo o total e o que falta em segundos
  const totalSeconds = (attendance?.duracao ?? 10) * 60
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds)

  // reinicia o timer toda vez que abre uma chamada nova
  useEffect(() => {
    if (open) setSecondsLeft(totalSeconds)
  }, [open, totalSeconds])

  // conta pra baixo enquanto estiver aberto; encerra sozinho no zero
  useEffect(() => {
    if (!open) return

    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          onClose() // tempo acabou = encerra
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [open, onClose])

  if (!open) return null

  const progress = (secondsLeft / totalSeconds) * 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[420px] overflow-hidden rounded-2xl bg-bg-card shadow-modal">

        {/* Status */}
        <div className="flex flex-col items-center px-6 pb-6 pt-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-success-600">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success-400" />
            </span>
            Chamada aberta
          </div>

          <h1 className="mt-3.5 text-[22px] font-bold text-text-primary">
            {attendance?.titulo}
          </h1>
          <p className="mt-0.5 text-sm text-text-secondary">
            {turma.name} · {turma.section}
          </p>
        </div>

        {/* Timer */}
        <div className="mx-6 rounded-2xl bg-neutral-50 p-6 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            Tempo restante
          </div>
          <div className="mt-1 text-[56px] font-bold leading-tight tabular-nums text-primary-800">
            {formatTime(secondsLeft)}
          </div>
          <div className="mt-3.5 h-1.5 overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-primary-400 transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Contador de presentes */}
        <div className="flex items-center justify-center gap-2.5 px-6 pb-2 pt-7">
          <Users className="h-[22px] w-[22px] text-primary-600" strokeWidth={1.75} />
          <div className="text-3xl font-bold tabular-nums text-text-primary">
            0{' '}
            <span className="text-lg font-normal text-text-secondary">
              de {turma.enrolledCount} presentes
            </span>
          </div>
        </div>

        {/* Estado vazio */}
        <div className="px-6 pb-6 pt-2 text-center">
          <p className="text-[13px] leading-relaxed text-text-muted">
            Aguardando os alunos confirmarem presença pelo aplicativo…
          </p>
        </div>

        {/* Encerrar */}
        <div className="border-t border-border-default px-6 pb-6 pt-[18px]">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-danger-100 bg-danger-50 text-[15px] font-semibold text-danger-600 transition hover:bg-danger-100"
          >
            <SquareX className="h-[18px] w-[18px]" strokeWidth={1.75} />
            Encerrar chamada
          </button>
        </div>

      </div>
    </div>
  )
}