import { app } from './app'
import { config, assertDbConfig } from './config.js'
import { pingDb } from './db.js'

async function main() {
  assertDbConfig()

  await pingDb()
  console.log('Database connected successfully!')

  app.listen(config.port, () => {
    console.log(`Plutus API running on http://localhost:${config.port}`)
  })
}

main().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})