import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { config } from './config.js'

export const app = express()

app.use(cors({ origin: config.corsOrigin }))
app.use(express.json({ limit: '100kb' }))

app.get('/', (_req, res) => {
  res.json({
    message: 'Plutus API is running!',
  })
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    error.type === 'entity.parse.failed'
  ) {
    res.status(400).json({ error: 'Invalid JSON body' })
    return
  }
  
  console.error(error)
  res.status(500).json({ error: 'Internal server error' })
})