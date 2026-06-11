import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Check, LocateFixed, MapPin, Navigation, ShieldCheck, User, X } from 'lucide-react'
import { getPrecisePosition } from '../utils/geolocation'
import { requestManualCheckIn } from '../services/classes.service'

function formatTime(totalSeconds = 0) {
  const safe = Math.max(0, Number(totalSeconds) || 0)
  const minutes = String(Math.floor(safe / 60)).padStart(2, '0')
  const seconds = String(safe % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

function distanceMeters(a, b) {
  if (!a || !b) return null
  const earth = 6371000
  const toRad = (value) => (value * Math.PI) / 180
  const dLat = toRad(b.latitude - a.latitude)
  const dLon = toRad(b.longitude - a.longitude)
  const lat1 = toRad(a.latitude)
  const lat2 = toRad(b.latitude)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return Math.round(2 * earth * Math.asin(Math.sqrt(h)))
}

function offsetFrom(lat, lon, metersNorth = 0, metersEast = 0) {
  const R = 6378137
  const dLat = metersNorth / R
  const dLon = metersEast / (R * Math.cos((lat * Math.PI) / 180))
  const newLat = lat + (dLat * 180) / Math.PI
  const newLon = lon + (dLon * 180) / Math.PI
  return { latitude: newLat, longitude: newLon, accuracy: Math.round(Math.max(Math.abs(metersNorth), Math.abs(metersEast))) }
}

function InfoRow({ icon: Icon, label, value, tone = 'default' }) {
  const valueTone =
    tone === 'danger'
      ? 'text-danger-600'
      : tone === 'success'
        ? 'text-success-600'
        : 'text-text-primary'

  return (
    <div className="flex items-center justify-between border-b border-border-default py-3 last:border-b-0">
      <div className="flex items-center gap-3 text-sm text-text-secondary">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <span className={`text-sm font-semibold ${valueTone}`}>{value}</span>
    </div>
  )
}

export function StudentCheckinModal({ open, onClose, session, onConfirm, mockDistance = null }) {
  const [location, setLocation] = useState(null)
  const [locating, setLocating] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [requested, setRequested] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(0)

  const distance = useMemo(
    () =>
      distanceMeters(
        session ? { latitude: session.latitude, longitude: session.longitude } : null,
        location
      ),
    [session, location]
  )
  const outOfRange = distance !== null && distance > Number(session?.radiusMeters ?? 0)
  const timeLeft = formatTime(secondsLeft)

  async function refreshLocation() {
    setLocating(true)
    setError('')
    try {
      if (mockDistance != null && session && typeof mockDistance === 'number') {
        const mocked = offsetFrom(Number(session.latitude), Number(session.longitude), 0, Number(mockDistance))
        setLocation(mocked)
      } else {
        setLocation(await getPrecisePosition({ desiredAccuracy: 20, timeoutMs: 5000 }))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível ler sua localização.')
    } finally {
      setLocating(false)
    }
  }

  useEffect(() => {
    if (open) {
      setLocation(null)
      setError('')
      setSuccess('')
      setSecondsLeft(Number(session?.secondsLeft ?? 0))
      refreshLocation()
    }
  }, [open, session?.id])

  useEffect(() => {
    if (!open) return

    const id = setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1))
    }, 1000)

    return () => clearInterval(id)
  }, [open, session?.id])

  if (!open || !session) return null

  async function handleConfirm() {
    if (!location || outOfRange || session.answered || secondsLeft <= 0) return

    setSubmitting(true)
    setError('')
    const result = await onConfirm({
      chamadaId: session.id,
      latitude: location.latitude,
      longitude: location.longitude,
    })
    setSubmitting(false)

    if (!result.success) {
      setError(result.error)
      return
    }
    setSuccess('Presença confirmada.')
  }

  async function handleManualRequest() {
    if (!session || session.answered || secondsLeft <= 0 || !outOfRange) return

    setRequesting(true)
    setError('')
    try {
      const result = await requestManualCheckIn({
        chamadaId: session.id,
        latitude: location?.latitude,
        longitude: location?.longitude,
      })
      setRequested(result.success)
      if (!result.success) {
        setError(result.error)
        return
      }
      setSuccess('Solicitação de chamada manual enviada para o professor.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar a solicitação.')
    } finally {
      setRequesting(false)
    }
  }

  const statusTone = session.answered || success ? 'success' : outOfRange ? 'danger' : 'success'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-bg-card shadow-card">
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition hover:bg-neutral-100"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col items-center px-6 pb-5 pt-8 text-center">
            <div className={`relative flex h-20 w-20 items-center justify-center rounded-full ${statusTone === 'danger' ? 'bg-danger-50' : 'bg-success-50'}`}>
              <MapPin className={`relative h-8 w-8 ${statusTone === 'danger' ? 'text-danger-600' : 'text-success-600'}`} />
            </div>

            <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-success-600">
              <span className="h-1.5 w-1.5 rounded-full bg-success-400" />
              Chamada ativa
            </div>

            <h2 className="mt-2 text-2xl font-bold text-text-primary">Confirmar presença</h2>
            <p className="mt-1 text-sm text-text-secondary">
              {session.subject} · {session.className}
            </p>
          </div>

          <div className="mx-6 grid grid-cols-2 gap-4 rounded-lg bg-neutral-50 p-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Tempo restante</div>
              <div className="mt-1 text-2xl font-bold tabular-nums text-text-primary">{timeLeft}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Localização</div>
              <div className={`mt-1 inline-flex items-center gap-1 text-sm font-semibold ${outOfRange ? 'text-danger-600' : 'text-success-600'}`}>
                {locating ? (
                  'Localizando...'
                ) : outOfRange ? (
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    Fora do raio
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    No raio
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="px-6 pt-2">
            <InfoRow
              icon={Navigation}
              label="Distância"
              value={distance === null ? 'Aguardando GPS' : `${distance}m de ${session.radiusMeters}m`}
              tone={outOfRange ? 'danger' : 'default'}
            />
            <InfoRow
              icon={LocateFixed}
              label="Precisão"
              value={location?.accuracy ? `±${location.accuracy}m` : 'Calculando'}
              tone={location?.accuracy && location.accuracy <= 25 ? 'success' : 'default'}
            />
            <InfoRow icon={User} label="Professor" value={session.professorName} />
            <InfoRow
              icon={ShieldCheck}
              label="Validação GPS"
              value={session.answered || success ? 'Respondida' : outOfRange ? 'Inválida' : 'Ativa'}
              tone={session.answered || success ? 'success' : outOfRange ? 'danger' : 'success'}
            />
          </div>

          {(error || success) && (
            <p className={`mx-6 mt-3 rounded-lg px-3 py-2 text-center text-sm font-semibold ${success ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'}`}>
              {success || error}
            </p>
          )}

          <div className="space-y-2 p-6 pt-4">
            <button
              type="button"
              onClick={refreshLocation}
              disabled={locating}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border-default bg-neutral-50 text-sm font-semibold text-text-primary transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {locating ? 'Atualizando localização...' : 'Atualizar localização'}
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={locating || submitting || !location || outOfRange || session.answered || Boolean(success) || secondsLeft <= 0}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-action-primary text-sm font-semibold text-action-primary-text shadow-card transition hover:bg-action-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check className="h-4 w-4" />
              {submitting ? 'Confirmando...' : session.answered || success ? 'Chamada respondida' : secondsLeft <= 0 ? 'Chamada encerrada' : 'Confirmar check-in'}
            </button>

          {(outOfRange || locating) && !session.answered && !success && !requested && (
            <button
              type="button"
              onClick={handleManualRequest}
              disabled={locating || requesting || secondsLeft <= 0}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-danger-200 bg-danger-50 text-sm font-semibold text-danger-700 transition hover:bg-danger-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {locating ? 'Aguardando localização...' : requesting ? 'Enviando...' : 'Solicitar chamada manual'}
            </button>
          )}

            <p className={`text-center text-xs ${outOfRange ? 'text-danger-600' : 'text-text-secondary'}`}>
              {outOfRange
                ? 'Entre no raio permitido e toque em atualizar localização para tentar novamente.'
                : 'Sua localização será validada pelo servidor no momento do envio.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
