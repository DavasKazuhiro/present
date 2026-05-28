import { get, run, transaction } from '../db/mysql.js'
import { hashPassword, verifyPassword } from '../utils/password.js'
import { toMysqlDateTime } from '../utils/dates.js'
import { normalizeUserRole } from '../utils/roles.js'
import {
  generateRefreshToken,
  hashToken,
  refreshExpiresAt,
  signAccessToken,
  type UserRole,
} from '../utils/tokens.js'

export type UserSafe = {
  id: string
  name: string
  email: string
  role: UserRole
}

function isDuplicateEntryError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ER_DUP_ENTRY'
  )
}

function toTimestamp(value: Date | string): number {
  return value instanceof Date ? value.getTime() : new Date(value).getTime()
}

export async function registerUser(input: {
  name: string
  email: string
  password: string
  role: UserRole | 'teacher' | 'student'
}): Promise<{ user: UserSafe; accessToken: string; refreshToken: string }> {
  const role = normalizeUserRole(input.role)
  if (!role) {
    throw new Error('Papel de usuário inválido.')
  }

  const existing = await get<{ id: number }>(
    'SELECT id FROM usuarios WHERE email = ?',
    [input.email]
  )
  if (existing) {
    throw new Error('E-mail já está em uso.')
  }

  const passwordHash = await hashPassword(input.password)

  try {
    await transaction(async (client) => {
      const insert = await run(
        `INSERT INTO usuarios (nome, email, senha, tipo)
         VALUES (?, ?, ?, ?)`,
        [input.name, input.email, passwordHash, role],
        client
      )

      const usuarioId = insert.insertId
      if (!usuarioId) throw new Error('Falha ao criar usuário.')

      if (role === 'professor') {
        await run(`INSERT INTO professores (usuario_id) VALUES (?)`, [usuarioId], client)
        return
      }

      await run(`INSERT INTO alunos (usuario_id) VALUES (?)`, [usuarioId], client)
    })
  } catch (error) {
    if (isDuplicateEntryError(error)) {
      throw new Error('E-mail já está em uso.')
    }

    throw error
  }

  return loginUser({ email: input.email, password: input.password })
}

export async function loginUser(input: {
  email: string
  password: string
}): Promise<{ user: UserSafe; accessToken: string; refreshToken: string }> {
  const user = await get<{
    id: number
    nome: string
    email: string
    senha: string
    tipo: UserRole
  }>(
    `SELECT id, nome, email, senha, tipo
     FROM usuarios
     WHERE email = ?
     LIMIT 1`,
    [input.email]
  )

  if (!user) {
    throw new Error('E-mail ou senha incorretos.')
  }

  const ok = await verifyPassword(input.password, user.senha)
  if (!ok) {
    throw new Error('E-mail ou senha incorretos.')
  }

  // Refresh token por sessão (rota de refresh faz rotação/revocação)
  const refreshToken = generateRefreshToken()
  const tokenHash = hashToken(refreshToken)

  await run(
    `INSERT INTO auth_refresh_tokens (usuario_id, token_hash, expires_at)
     VALUES (?, ?, ?)`,
    [user.id, tokenHash, refreshExpiresAt()]
  )

  const userSafe: UserSafe = {
    id: String(user.id),
    name: user.nome,
    email: user.email,
    role: user.tipo,
  }
  return {
    user: userSafe,
    accessToken: signAccessToken({ id: String(user.id), role: user.tipo }),
    refreshToken,
  }
}

export async function refreshAccessToken(input: { refreshToken: string }): Promise<{
  user: UserSafe
  accessToken: string
  refreshToken: string
}> {
  const tokenHash = hashToken(input.refreshToken)
  const row = await get<{
    id: number
    usuario_id: number
    expires_at: Date | string
    revoked_at: Date | string | null
  }>(
    `SELECT id, usuario_id, expires_at, revoked_at
     FROM auth_refresh_tokens
     WHERE token_hash = ?
     LIMIT 1`,
    [tokenHash]
  )

  if (!row || row.revoked_at) {
    throw new Error('Refresh token inválido.')
  }

  const expiresAt = toTimestamp(row.expires_at)
  if (Number.isNaN(expiresAt) || expiresAt <= Date.now()) {
    throw new Error('Refresh token expirado.')
  }

  // Revoke old token (rotação)
  await run(
    `UPDATE auth_refresh_tokens
     SET revoked_at = ?
     WHERE id = ?`,
    [toMysqlDateTime(), row.id]
  )

  const user = await get<{
    id: number
    nome: string
    email: string
    tipo: UserRole
  }>('SELECT id, nome, email, tipo FROM usuarios WHERE id = ? LIMIT 1', [row.usuario_id])

  if (!user) throw new Error('Usuário não encontrado.')

  const refreshToken = generateRefreshToken()
  const newTokenHash = hashToken(refreshToken)

  await run(
    `INSERT INTO auth_refresh_tokens (usuario_id, token_hash, expires_at)
     VALUES (?, ?, ?)`,
    [user.id, newTokenHash, refreshExpiresAt()]
  )

  const userSafe: UserSafe = {
    id: String(user.id),
    name: user.nome,
    email: user.email,
    role: user.tipo,
  }

  return {
    user: userSafe,
    accessToken: signAccessToken({ id: String(user.id), role: user.tipo }),
    refreshToken,
  }
}

export async function logout(input: { refreshToken: string }): Promise<void> {
  const tokenHash = hashToken(input.refreshToken)
  await run(
    `UPDATE auth_refresh_tokens
     SET revoked_at = ?
     WHERE token_hash = ? AND revoked_at IS NULL`,
    [toMysqlDateTime(), tokenHash]
  )
}

export async function getUserById(id: string): Promise<UserSafe | null> {
  const user = await get<{
    id: number
    nome: string
    email: string
    tipo: UserRole
  }>(
    'SELECT id, nome, email, tipo FROM usuarios WHERE id = ? LIMIT 1',
    [id]
  )

  if (!user) return null
  return { id: String(user.id), name: user.nome, email: user.email, role: user.tipo }
}
