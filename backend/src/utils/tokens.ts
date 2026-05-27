import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { toMysqlDateTime } from './dates'
import { isUserRole, type UserRole } from './roles'

export type { UserRole } from './roles'

export function signAccessToken(user: { id: string; role: UserRole }) {
  return jwt.sign(
    {
      tokenType: 'access',
      role: user.role,
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.ACCESS_TOKEN_TTL_SECONDS, subject: user.id }
  )
}

export type AccessTokenPayload = {
  tokenType: 'access'
  sub: string
  role: UserRole
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as unknown

  if (
    typeof payload === 'object' &&
    payload !== null &&
    'tokenType' in payload &&
    payload.tokenType === 'access' &&
    'sub' in payload &&
    typeof payload.sub === 'string' &&
    payload.sub.trim().length > 0 &&
    'role' in payload &&
    isUserRole(payload.role)
  ) {
    return {
      tokenType: 'access',
      sub: payload.sub,
      role: payload.role,
    }
  }

  throw new Error('Invalid access token')
}

export function generateRefreshToken() {
  // token opaco (não-robust), validado pelo hash no banco
  return crypto.randomBytes(32).toString('base64url')
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function refreshExpiresAt() {
  const ms = env.REFRESH_TOKEN_TTL_SECONDS * 1000
  return toMysqlDateTime(new Date(Date.now() + ms))
}
