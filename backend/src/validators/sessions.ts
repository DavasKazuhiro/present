import { z } from 'zod'

export const OpenSessionSchema = z.object({
  turmaId: z.coerce.number().int().positive(),
  titulo: z.string().trim().max(120).optional(),
  conteudo: z.string().max(2000).optional(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  raioMetros: z.coerce.number().int().min(5).max(200).default(20),
  duracaoMinutos: z.coerce.number().int().min(1).max(30).default(7),
})

export const CheckInSchema = z.object({
  chamadaId: z.coerce.number().int().positive(),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
})

export const ManualRequestSchema = z.object({
  chamadaId: z.coerce.number().int().positive(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
})
