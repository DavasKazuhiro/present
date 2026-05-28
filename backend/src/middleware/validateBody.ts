import type { ZodSchema } from 'zod'

export function validateBody(schema: ZodSchema) {
  return (req: any, res: any, next: any) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.issues.map((i) => i.message).join('. '),
      })
    }

    req.body = parsed.data
    return next()
  }
}

