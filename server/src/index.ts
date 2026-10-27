import { app } from './app'

async function main() {
  const PORT = 3000

  app.listen(PORT, () => {
    console.log(`Plutus API running on http://localhost:${PORT}`)
  })
}

main().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})