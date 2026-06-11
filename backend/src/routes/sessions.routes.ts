import express from 'express'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAuth } from '../middleware/requireAuth'
import { requireRole } from '../middleware/requireRole'
import { validateBody } from '../middleware/validateBody'
import { CheckInSchema, ManualRequestSchema, OpenSessionSchema } from '../validators/sessions'
import {
  closeClassSession,
  getAttendanceDetail,
  getStudentSession,
  listStudentClassSessions,
  listClassSessions,
  listStudentNotifications,
  openClassSession,
  requestManualCheckIn,
  approveManualCheckIn,
  listAttendanceRequests,
  studentCheckIn,
} from '../services/sessionsService'

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
      titulo: req.body.titulo,
      conteudo: req.body.conteudo,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      raioMetros: req.body.raioMetros,
      duracaoMinutos: req.body.duracaoMinutos,
    })

    return res.json({ success: true, session })
  })
)

router.post(
  '/:chamadaId/close',
  requireAuth,
  requireRole(['professor']),
  asyncHandler(async (req, res) => {
    const result = await closeClassSession({
      professorUsuarioId: req.user!.id,
      chamadaId: Number(req.params.chamadaId),
    })
    return res.json({ success: true, session: result })
  })
)

router.get(
  '/teacher/classes/:turmaId',
  requireAuth,
  requireRole(['professor']),
  asyncHandler(async (req, res) => {
    const sessions = await listClassSessions({
      professorUsuarioId: req.user!.id,
      turmaId: Number(req.params.turmaId),
    })
    return res.json({ success: true, sessions })
  })
)

router.get(
  '/teacher/classes/:turmaId/:chamadaId',
  requireAuth,
  requireRole(['professor']),
  asyncHandler(async (req, res) => {
    const detail = await getAttendanceDetail({
      professorUsuarioId: req.user!.id,
      turmaId: Number(req.params.turmaId),
      chamadaId: Number(req.params.chamadaId),
    })
    return res.json({ success: true, ...detail })
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
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      })
      return res.json({ success: true, checkIn })
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err?.message ?? 'Falha no check-in.' })
    }
  })
)

router.post(
  '/manual-request',
  requireAuth,
  requireRole(['aluno']),
  validateBody(ManualRequestSchema),
  asyncHandler(async (req, res) => {
    try {
      const request = await requestManualCheckIn({
        studentUsuarioId: req.user!.id,
        chamadaId: req.body.chamadaId,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      })
      return res.json({ success: true, request })
    } catch (err: any) {
      return res.status(400).json({ success: false, error: err?.message ?? 'Falha ao solicitar chamada manual.' })
    }
  })
)

router.get(
  '/teacher/classes/:turmaId/:chamadaId/requests',
  requireAuth,
  requireRole(['professor']),
  asyncHandler(async (req, res) => {
    const requests = await listAttendanceRequests({
      professorUsuarioId: req.user!.id,
      turmaId: Number(req.params.turmaId),
      chamadaId: Number(req.params.chamadaId),
    })
    return res.json({ success: true, requests })
  })
)

router.post(
  '/:chamadaId/requests/:requestId/approve',
  requireAuth,
  requireRole(['professor']),
  asyncHandler(async (req, res) => {
    const approval = await approveManualCheckIn({
      professorUsuarioId: req.user!.id,
      requestId: Number(req.params.requestId),
    })
    return res.json({ success: true, approval })
  })
)

router.get(
  '/notifications',
  requireAuth,
  requireRole(['aluno']),
  asyncHandler(async (req, res) => {
    const notifications = await listStudentNotifications(req.user!.id)
    return res.json({ success: true, notifications })
  })
)

router.get(
  '/student/:chamadaId',
  requireAuth,
  requireRole(['aluno']),
  asyncHandler(async (req, res) => {
    const session = await getStudentSession(req.user!.id, Number(req.params.chamadaId))
    return res.json({ success: true, session })
  })
)

router.get(
  '/student/classes/:turmaId',
  requireAuth,
  requireRole(['aluno']),
  asyncHandler(async (req, res) => {
    const sessions = await listStudentClassSessions({
      studentUsuarioId: req.user!.id,
      turmaId: Number(req.params.turmaId),
    })
    return res.json({ success: true, sessions })
  })
)

export default router
