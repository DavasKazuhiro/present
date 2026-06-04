import { useState } from "react";
import {
  MapPin,
  Navigation,
  User,
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  PhoneCall,
} from "lucide-react";

function InfoRow({
  icon: Icon,
  label,
  value,
  tone = "default",
}) {
  const valueTone =
    tone === "danger"
      ? "text-danger-600"
      : tone === "success"
      ? "text-success-600"
      : "text-text-primary";

  return (
    <div className="flex items-center justify-between border-b border-border-default py-3 last:border-b-0">
      <div className="flex items-center gap-3 text-sm text-text-secondary">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>

      <span className={`text-sm font-semibold ${valueTone}`}>
        {value}
      </span>
    </div>
  );
}

export function StudentCheckinModal({
  open = true,
  onClose = () => {},
  classTitle = "Engenharia de Software · Sala B-204",
  professor = "Carlos Andrade",
  timeLeft = "06:42",
  distance = 38,
  maxDistance = 50,
  onConfirm = () => {},
  onRequestManual = () => {},
}) {
  const [inRange, setInRange] = useState(true);

  if (!open) return null;

  const outOfRange = !inRange;

  const [minutes, seconds] = timeLeft.split(":");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-bg-card shadow-card">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="
            absolute right-4 top-4 z-10
            inline-flex h-8 w-8 items-center justify-center
            rounded-full
            text-text-secondary
            transition
            hover:bg-neutral-100
          "
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center px-6 pb-5 pt-8 text-center">
          <div
            className={`relative flex h-20 w-20 items-center justify-center rounded-full ${
              outOfRange
                ? "bg-danger-50"
                : "bg-success-50"
            }`}
          >
            <div
              className={`absolute inset-0 animate-ping rounded-full opacity-30 ${
                outOfRange
                  ? "bg-danger-400"
                  : "bg-success-400"
              }`}
            />

            <MapPin
              className={`relative h-8 w-8 ${
                outOfRange
                  ? "text-danger-600"
                  : "text-success-600"
              }`}
            />
          </div>

          <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-success-600">
            <span className="h-1.5 w-1.5 rounded-full bg-success-400" />
            Chamada ativa
          </div>

          <h2 className="mt-2 text-2xl font-bold text-text-primary">
            Confirmar presença
          </h2>

          <p className="mt-1 text-sm text-text-secondary">
            {classTitle}
          </p>
        </div>

        {/* Estatísticas */}
        <div className="mx-6 grid grid-cols-2 gap-4 rounded-2xl bg-neutral-50 p-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              Tempo restante
            </div>

            <div className="mt-1 text-2xl font-bold tabular-nums text-text-primary">
              {minutes}
              <span className="text-text-secondary">
                :{seconds}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
              Localização
            </div>

            <div
              className={`mt-1 inline-flex items-center gap-1 text-sm font-semibold ${
                outOfRange
                  ? "text-danger-600"
                  : "text-success-600"
              }`}
            >
              {outOfRange ? (
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

        {/* Simulação */}
        <div className="mx-6 mt-3 flex items-center justify-between rounded-xl border border-dashed border-border-default px-3 py-2 text-xs text-text-secondary">
          <span>Simular fora do raio</span>

          <button
            onClick={() => setInRange((prev) => !prev)}
            className={`relative h-5 w-9 rounded-full transition ${
              outOfRange
                ? "bg-danger-400"
                : "bg-neutral-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
                outOfRange
                  ? "left-4"
                  : "left-0.5"
              }`}
            />
          </button>
        </div>

        {/* Informações */}
        <div className="px-6 pt-2">
          <InfoRow
            icon={Navigation}
            label="Distância da sala"
            value={`${distance}m de ${maxDistance}m`}
            tone={outOfRange ? "danger" : "default"}
          />

          <InfoRow
            icon={User}
            label="Professor"
            value={professor}
          />

          <InfoRow
            icon={ShieldCheck}
            label="Validação GPS"
            value={
              outOfRange
                ? "Inválida"
                : "✓ Ativa"
            }
            tone={
              outOfRange
                ? "danger"
                : "success"
            }
          />
        </div>

        {/* Ações */}
        <div className="space-y-2 p-6 pt-4">
          <button
            onClick={onConfirm}
            disabled={outOfRange}
            className="
              inline-flex h-12 w-full items-center justify-center gap-2
              rounded-2xl
              bg-action-primary
              text-action-primary-text
              text-sm font-semibold
              shadow-card
              transition
              hover:bg-action-primary-hover
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Check className="h-4 w-4" />
            Confirmar check-in
          </button>

          {outOfRange && (
            <button
              onClick={onRequestManual}
              className="
                inline-flex h-12 w-full items-center justify-center gap-2
                rounded-2xl
                border border-danger-100
                bg-danger-50
                text-sm font-semibold
                text-danger-600
                transition
                hover:bg-danger-100
              "
            >
              <PhoneCall className="h-4 w-4" />
              Solicitar chamada manual
            </button>
          )}

          <p
            className={`text-center text-xs ${
              outOfRange
                ? "text-danger-600"
                : "text-text-secondary"
            }`}
          >
            {outOfRange
              ? "Você está fora do raio permitido para o check-in"
              : "Sua localização será validada uma única vez"}
          </p>
        </div>
      </div>
    </div>
  );
}