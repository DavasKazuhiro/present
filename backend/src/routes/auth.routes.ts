import express from 'express'
import { asyncHandler } from '../middleware/asyncHandler'
import { validateBody } from '../middleware/validateBody'
import { requireAuth } from '../middleware/requireAuth'
import {
  RegisterSchema,
  LoginSchema,
  RefreshSchema,
  LogoutSchema,
} from '../validators/auth'
import {
  getUserById,
  loginUser,
  logout,
  refreshAccessToken,
  registerUser,
} from '../services/authService.js'

const router = express.Router()

router.post(
  '/register',
  validateBody(RegisterSchema),
  asyncHandler(async (req, res) => {
    try {
      const result = await registerUser(req.body)
      return res.json({ success: true, user: result.user, tokens: { accessToken: result.accessToken, refreshToken: result.refreshToken } })
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err?.message ?? 'Falha no cadastro.' })
    }
  })
)

router.post(
  '/login',
  validateBody(LoginSchema),
  asyncHandler(async (req, res) => {
    try {
      const result = await loginUser(req.body)
      return res.json({ success: true, user: result.user, tokens: { accessToken: result.accessToken, refreshToken: result.refreshToken } })
    } catch (err: any) {
      return res.status(401).json({ success: false, error: err?.message ?? 'E-mail ou senha incorretos.' })
    }
  })
)

router.post(
  '/refresh',
  validateBody(RefreshSchema),
  asyncHandler(async (req, res) => {
    try {
      const result = await refreshAccessToken({ refreshToken: req.body.refreshToken })
      return res.json({ success: true, user: result.user, tokens: { accessToken: result.accessToken, refreshToken: result.refreshToken } })
    } catch (err: any) {
      return res.status(401).json({ success: false, error: err?.message ?? 'Refresh inválido.' })
    }
  })
)

router.post(
  '/logout',
  validateBody(LogoutSchema),
  asyncHandler(async (req, res) => {
    try {
      await logout({ refreshToken: req.body.refreshToken })
      return res.json({ success: true })
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err?.message ?? 'Falha no logout.' })
    }
  })
)

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ success: false, error: 'Acesso não autorizado.' })

    const user = await getUserById(userId)
    if (!user) return res.status(401).json({ success: false, error: 'Usuário não encontrado.' })

    return res.json({ success: true, user })
  })
)

export default router
