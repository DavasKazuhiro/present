export const USER_ROLES = ['aluno', 'professor'] as const

export type UserRole = (typeof USER_ROLES)[number]

const ROLE_ALIASES: Record<string, UserRole> = {
  aluno: 'aluno',
  student: 'aluno',
  professor: 'professor',
  teacher: 'professor',
}

export function normalizeUserRole(role: unknown): UserRole | null {
  if (typeof role !== 'string') return null
  return ROLE_ALIASES[role.trim().toLowerCase()] ?? null
}

export function isUserRole(role: unknown): role is UserRole {
  return normalizeUserRole(role) === role
}
