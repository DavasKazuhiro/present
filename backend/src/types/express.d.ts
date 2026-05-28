import type { UserRole } from '../utils/roles'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        role: UserRole
      }
    }
  }
}

export {}
