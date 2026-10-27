import 'dotenv/config'
import { readFileSync } from 'node:fs'

function required (name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env var: ${name}`)
  }
  return value
}

const sslCaPath = process.env.DB_SSL_CA
const sslEnabled = process.env.DB_SSL !== 'false'

function normalizeDatabaseUrl (raw: string | undefined): string | undefined {
  if (!raw) return undefined
  const url = new URL(raw)
  // mysql2 does not understand Aiven's ssl-mode query param.
  url.searchParams.delete('ssl-mode')
  const query = url.searchParams.toString()
  url.search = query ? `?${query}` : ''
  return url.toString()
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  db: {
    url: normalizeDatabaseUrl(process.env.DATABASE_URL),
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: sslEnabled
      ? sslCaPath
        ? { ca: readFileSync(sslCaPath, 'utf8'), rejectUnauthorized: true }
        : { rejectUnauthorized: false }
      : undefined
  }
}

export function assertDbConfig (): void {
  if (config.db.url) return
  required('DB_HOST')
  required('DB_USER')
  required('DB_PASSWORD')
  required('DB_NAME')
}