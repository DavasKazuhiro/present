import { z } from 'zod'

export const CreateClassSchema = z.object({
  nome: z.string().trim().min(2).max(100),
  disciplina: z.string().trim().min(2).max(100),
  curso: z.string().trim().min(2).max(100),
  descricao: z.string().trim().max(2000).optional(),
  cor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#2563eb'),
  turno: z.enum(['Manhã', 'Tarde', 'Noite', 'Integral']).default('Noite'),
  horaInicio: z.string().regex(/^\d{2}:\d{2}$/),
  horaFim: z.string().regex(/^\d{2}:\d{2}$/),
  horarios: z
    .array(
      z.object({
        diaSemana: z.coerce.number().int().min(0).max(6),
        horaInicio: z.string().regex(/^\d{2}:\d{2}$/),
        horaFim: z.string().regex(/^\d{2}:\d{2}$/),
      })
    )
    .optional(),
})

export const EnrollStudentSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
})

export const JoinInviteSchema = z.object({
  token: z.string().trim().min(16).max(80),
})
