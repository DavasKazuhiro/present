import { app } from './app'
import { env } from './config/env'
import { initDb } from './db/mysql'

async function main() {
  await initDb()

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

