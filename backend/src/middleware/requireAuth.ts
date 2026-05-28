import type { RequestHandler } from 'express'
import { get } from '../db/mysql.js'
import { verifyAccessToken } from '../utils/tokens.js'
import type { UserRole } from '../utils/roles.js'

export const requireAuth: RequestHandler = async (req, res, next) => {
  const authHeader = req.header('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Acesso não autorizado.' })
  }

  const token = authHeader.slice('Bearer '.length).trim()
  if (!token) {
    return res.status(401).json({ success: false, error: 'Acesso não autorizado.' })
  }

  try {
    const payload = verifyAccessToken(token)
    const user = await get<{ id: number; tipo: UserRole }>(
      'SELECT id, tipo FROM usuarios WHERE id = ? LIMIT 1',
      [payload.sub]
    )

    if (!user) {
      return res.status(401).json({ success: false, error: 'Token inválido ou expirado.' })
    }

    req.user = { id: String(user.id), role: user.tipo }
    return next()
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'Banco não inicializado. Execute initDb() primeiro.'
    ) {
      return next(error)
    }

    return res.status(401).json({ success: false, error: 'Token inválido ou expirado.' })
  }
}
