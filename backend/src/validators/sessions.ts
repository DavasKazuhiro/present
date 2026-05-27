import { z } from 'zod'

export const OpenSessionSchema = z.object({
  turmaId: z.coerce.number().int().positive(),
  conteudo: z.string().max(2000).optional(),
  latitude: z.coerce.number().min(-90).max(90).optional(),
  longitude: z.coerce.number().min(-180).max(180).optional(),
})

export const CheckInSchema = z.object({
  chamadaId: z.coerce.number().int().positive(),
})

