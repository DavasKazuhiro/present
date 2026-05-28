import cors from 'cors'
import express from 'express'
import authRoutes from './routes/auth.routes'
import sessionsRoutes from './routes/sessions.routes'
import { errorHandler } from './middleware/errorHandler'

export const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => res.json({ ok: true }))

app.use('/auth', authRoutes)
app.use('/sessions', sessionsRoutes)

app.use((_req, res) => res.status(404).json({ success: false, error: 'Rota não encontrada.' }))
app.use(errorHandler)

