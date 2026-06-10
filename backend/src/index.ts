import { app } from './app'
import { env } from './config/env'
import { initDb } from './db/mysql'
import { autoCloseExpiredSessions } from './services/sessionsService'

async function main() {
  await initDb()
  await autoCloseExpiredSessions()

  setInterval(() => {
    autoCloseExpiredSessions().catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Falha ao encerrar chamadas expiradas:', err)
    })
  }, 60 * 1000)

  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend rodando em http://localhost:${env.PORT}`)
  })
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Falha ao iniciar backend:', err)
  process.exit(1)
})
