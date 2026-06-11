import { useState } from 'react'
import { X, Radio } from 'lucide-react'

const DURACOES = [7, 10, 15, 20]

export default function NewAttendanceModal({ open, onClose, turma, proximoNumero, opening = false, onAbrir }) {
  const [titulo, setTitulo] = useState('')
  const [duracao, setDuracao] = useState(7)
  const [raio, setRaio] = useState(20)
  const [conteudo, setConteudo] = useState('')

  if (!open) return null

  function handleAbrir() {
    onAbrir({
      titulo: titulo.trim() || `Chamada ${proximoNumero}`,
      duracao,
      raio,
      conteudo: conteudo.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-bg-card shadow-modal">

        {/* Header */}
        <div className="relative border-b border-border-default px-6 pb-5 pt-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition hover:bg-neutral-100"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
          <h1 className="text-2xl font-bold text-text-primary">Nova chamada</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {turma.name} · {turma.section}
          </p>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 px-6 py-6">

          {/* Título */}
          <div>
            <label htmlFor="titulo" className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-secondary">
              Título <span className="font-normal normal-case tracking-normal text-neutral-300">(opcional)</span>
            </label>
            <input
              id="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder={`Chamada ${proximoNumero}`}
              className="h-[42px] w-full rounded-lg border border-border-default px-3.5 text-sm text-text-primary outline-none transition focus:border-primary-300"
            />
          </div>

          {/* Duração */}
          <div>
            <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-secondary">Duração</span>
            <div className="grid grid-cols-4 gap-2">
              {DURACOES.map((min) => (
                <button
                  key={min}
                  type="button"
                  onClick={() => setDuracao(min)}
                  className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                    duracao === min
                      ? 'bg-primary-800 text-neutral-0'
                      : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {min}'
                </button>
              ))}
            </div>
          </div>

          {/* Raio */}
          <div>
            <span className="mb-2.5 block text-xs font-medium uppercase tracking-wider text-text-secondary">
              Raio · {raio}m
            </span>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={raio}
              onChange={(e) => setRaio(Number(e.target.value))}
              className="w-full accent-primary-400"
            />
            <div className="mt-2 flex items-center justify-between text-xs text-text-secondary">
              <span>10m</span>
              <span><strong className="font-semibold text-success-600">{raio}m</strong> selecionado</span>
              <span>200m</span>
            </div>
          </div>

          {/* Conteúdo ministrado */}
          <div>
            <label htmlFor="conteudo" className="mb-2 block text-xs font-medium uppercase tracking-wider text-text-secondary">
              Conteúdo ministrado <span className="font-normal normal-case tracking-normal text-neutral-300">(opcional)</span>
            </label>
            <textarea
              id="conteudo"
              rows={2}
              value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
              placeholder="Ex: princípios SOLID, refatoração de código..."
              className="w-full resize-none rounded-lg border border-border-default px-3.5 py-2.5 text-sm leading-relaxed text-text-primary outline-none transition focus:border-primary-300"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-border-default px-6 pb-6 pt-[18px]">
          <button
            type="button"
            onClick={handleAbrir}
            disabled={opening}
            className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[15px] font-semibold text-neutral-0 shadow-card transition active:scale-[0.99] ${opening ? 'bg-neutral-300' : 'bg-primary-800 hover:bg-primary-900'}`}
          >
            <Radio className="h-[18px] w-[18px]" strokeWidth={1.75} />
            {opening ? 'Abrindo chamada...' : 'Abrir chamada'}
          </button>
        </div>

      </div>
    </div>
  )
}
