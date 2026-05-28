import type { RequestHandler } from 'express'
import type { UserRole } from '../utils/tokens.js'

export function requireRole(allowed: UserRole[]): RequestHandler {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, error: 'Acesso não autorizado.' })
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Acesso negado para este papel.' })
    }
    return next()
  }
}

