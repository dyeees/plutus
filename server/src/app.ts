import express from 'express'
import type { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import session from 'express-session'
import MySQLStoreFactory from 'express-mysql-session'

import { config } from './config.js'
import { pool } from './db.js'
import { authRouter } from './routes/auth.js'
import { billsRouter } from './routes/bills.js'
import { loansRouter } from './routes/loans.js'

const MySQLStore = MySQLStoreFactory(session)
const sessionStore = new MySQLStore({}, pool as any)

export const app = express()
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
)
app.use(express.json({ limit: '100kb' }))

app.use(
  session({
    name: 'plutus.sid',
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    },
  }),
)

app.use('/api/auth', authRouter)
app.use('/api/bills', billsRouter)
app.use('/api/loans', loansRouter)


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