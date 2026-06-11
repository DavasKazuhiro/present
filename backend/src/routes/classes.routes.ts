import express from 'express'
import { asyncHandler } from '../middleware/asyncHandler'
import { requireAuth } from '../middleware/requireAuth'
import { requireRole } from '../middleware/requireRole'
import { validateBody } from '../middleware/validateBody'
import { CreateClassSchema, EnrollStudentSchema } from '../validators/classes'
import {
  createClass,
  enrollStudentByEmail,
  getStudentClass,
  getTeacherClass,
  getOrCreateInviteLink,
  joinClassByInvite,
  listAvailableStudents,
  listClassStudents,
  listStudentClasses,
  listTeacherClasses,
  regenerateInviteLink,
  removeStudentFromClass,
} from '../services/classesService'

const router = express.Router()

router.get(
  '/teacher',
  requireAuth,
  requireRole(['professor']),
  asyncHandler(async (req, res) => {
    const classes = await listTeacherClasses(req.user!.id)
    return res.json({ success: true, classes })
  })
)

router.post(
  '/teacher',
  requireAuth,
  requireRole(['professor']),
  validateBody(CreateClassSchema),
  asyncHandler(async (req, res) => {
    const created = await createClass(req.user!.id, req.body)
    return res.status(201).json({ success: true, class: created })
  })
)

router.get(
  '/teacher/:turmaId',
  requireAuth,
  requireRole(['professor']),
  asyncHandler(async (req, res) => {
    const turma = await getTeacherClass(req.user!.id, Number(req.params.turmaId))
    if (!turma) return res.status(404).json({ success: false, error: 'Turma não encontrada.' })
    return res.json({ success: true, class: turma })
  })
)

router.get(
  '/teacher/:turmaId/students',
  requireAuth,
  requireRole(['professor']),
  asyncHandler(async (req, res) => {
    const students = await listClassStudents(req.user!.id, Number(req.params.turmaId))
    return res.json({ success: true, students })
  })
)

router.get(
  '/teacher/:turmaId/available-students',
  requireAuth,
  requireRole(['professor']),
  asyncHandler(async (req, res) => {
    const students = await listAvailableStudents(req.user!.id, Number(req.params.turmaId))
    return res.json({ success: true, students })
  })
)

router.post(
  '/teacher/:turmaId/students',
  requireAuth,
  requireRole(['professor']),
  validateBody(EnrollStudentSchema),
  asyncHandler(async (req, res) => {
    const student = await enrollStudentByEmail(
      req.user!.id,
      Number(req.params.turmaId),
      req.body.email
    )
    return res.status(201).json({ success: true, student })
  })
)

router.delete(
  '/teacher/:turmaId/students/:alunoId',
  requireAuth,
  requireRole(['professor']),
  asyncHandler(async (req, res) => {
    const result = await removeStudentFromClass(
      req.user!.id,
      Number(req.params.turmaId),
      Number(req.params.alunoId)
    )
    return res.json({ success: true, ...result })
  })
)

router.get(
  '/teacher/:turmaId/invite-link',
  requireAuth,
  requireRole(['professor']),
  asyncHandler(async (req, res) => {
    const invite = await getOrCreateInviteLink(req.user!.id, Number(req.params.turmaId))
    return res.json({ success: true, invite })
  })
)

router.post(
  '/teacher/:turmaId/invite-link/regenerate',
  requireAuth,
  requireRole(['professor']),
  asyncHandler(async (req, res) => {
    const invite = await regenerateInviteLink(req.user!.id, Number(req.params.turmaId))
    return res.json({ success: true, invite })
  })
)

router.get(
  '/student',
  requireAuth,
  requireRole(['aluno']),
  asyncHandler(async (req, res) => {
    const classes = await listStudentClasses(req.user!.id)
    return res.json({ success: true, classes })
  })
)

router.get(
  '/student/:turmaId',
  requireAuth,
  requireRole(['aluno']),
  asyncHandler(async (req, res) => {
    const turma = await getStudentClass(req.user!.id, Number(req.params.turmaId))
    if (!turma) return res.status(404).json({ success: false, error: 'Matéria não encontrada.' })
    return res.json({ success: true, class: turma })
  })
)

router.post(
  '/join/:token',
  requireAuth,
  requireRole(['aluno']),
  asyncHandler(async (req, res) => {
    const token = req.params.token
    if (!token || Array.isArray(token)) {
      return res.status(400).json({ success: false, error: 'Convite inválido.' })
    }
    const result = await joinClassByInvite(req.user!.id, token)
    return res.status(201).json({ success: true, enrollment: result })
  })
)

export default router
