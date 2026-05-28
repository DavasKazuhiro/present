import type { ErrorRequestHandler } from 'express'

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  // Evita vazar stack em produção; para agora, devolve mensagem simples.
  const message = err instanceof Error ? err.message : 'Erro interno.'
  return res.status(500).json({ success: false, error: message })
}

