import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { joinClassByInvite } from '../services/classes.service'

export default function JoinClassPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('Entrando na matéria...')

  useEffect(() => {
    let mounted = true

    async function join() {
      const result = await joinClassByInvite(token)
      if (!mounted) return

      if (!result.success) {
        setStatus('error')
        setMessage(result.error)
        return
      }

      setStatus('success')
      setMessage(`Você entrou em ${result.enrollment.subject}.`)
      setTimeout(() => navigate('/dashboard/student', { replace: true }), 1400)
    }

    join()

    return () => {
      mounted = false
    }
  }, [token, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0F2F0] p-5">
      <div className="w-full max-w-sm rounded-lg border border-border-default bg-bg-card p-6 text-center shadow-card">
        <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-700">
          {status === 'loading' ? (
            <Loader2 className="h-7 w-7 animate-spin" />
          ) : status === 'success' ? (
            <CheckCircle2 className="h-7 w-7 text-success-600" />
          ) : (
            <XCircle className="h-7 w-7 text-danger-600" />
          )}
        </div>
        <h1 className="text-xl font-bold text-text-primary">
          {status === 'error' ? 'Convite indisponível' : 'Convite de matéria'}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">{message}</p>
        {status === 'error' && (
          <button
            type="button"
            onClick={() => navigate('/dashboard/student', { replace: true })}
            className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-primary-800 px-4 text-sm font-semibold text-neutral-0"
          >
            Voltar para minhas matérias
          </button>
        )}
      </div>
    </div>
  )
}
