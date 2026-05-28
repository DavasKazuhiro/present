import { z } from 'zod'
import { normalizeUserRole } from '../utils/roles'

const RoleSchema = z
  .enum(['aluno', 'professor', 'student', 'teacher'])
  .transform((role, ctx) => {
    const normalizedRole = normalizeUserRole(role)
    if (!normalizedRole) {
      ctx.addIssue({ code: 'custom', message: 'Papel de usuário inválido.' })
      return z.NEVER
    }

    return normalizedRole
  })

export const RegisterSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(6).max(200),
  role: RoleSchema,
})

export const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(1).max(200),
})

export const RefreshSchema = z.object({
  refreshToken: z.string().min(30),
})

export const LogoutSchema = z.object({
  refreshToken: z.string().min(30),
})
