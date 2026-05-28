import express from 'express'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAuth } from '../middleware/requireAuth'
import { requireRole } from '../middleware/requireRole'
import { validateBody } from '../middleware/validateBody'
import { CheckInSchema, OpenSessionSchema } from '../validators/sessions'
import { openClassSession, studentCheckIn } from '../services/sessionsService'

const router = express.Router()

router.post(
  '/open',
  requireAuth,
  requireRole(['professor']),
  validateBody(OpenSessionSchema),
  asyncHandler(async (req, res) => {
    const session = await openClassSession({
      professorUsuarioId: req.user!.id,
      turmaId: req.body.turmaId,
      conteudo: req.body.conteudo,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
    })

    return res.json({ success: true, session })
  })
)

router.post(
  '/check-in',
  requireAuth,
  requireRole(['aluno']),
  validateBody(CheckInSchema),
  asyncHandler(async (req, res) => {
    try {
      const checkIn = await studentCheckIn({
        studentUsuarioId: req.user!.id,
        chamadaId: req.body.chamadaId,
      })
      return res.json({ success: true, checkIn })
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err?.message ?? 'Falha no check-in.' })
    }
  })
)

export default router

