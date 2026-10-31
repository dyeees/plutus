import mysql from 'mysql2/promise'
import { config } from './config.js'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

export const pool = config.db.url
  ? mysql.createPool({
      uri: config.db.url,
      waitForConnections: true,
      connectionLimit: 10,
      timezone: 'Z',
      ...(config.db.ssl ? { ssl: config.db.ssl } : {})
    })
  : mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      timezone: 'Z',
      ...(config.db.ssl ? { ssl: config.db.ssl } : {})
    })

export async function pingDb (): Promise<void> {
  const connection = await pool.getConnection()
  try {
    await connection.ping()
    console.log('Database connected successfully!')
  } finally {
    connection.release()
  }
}

export async function initializeDatabase(): Promise<void> {
  const schemaPath = resolve(process.cwd(), 'schema.sql')
  const schema = await readFile(schemaPath, 'utf8')
  await pool.query(schema)
  console.log('Database schema initialized successfully!')
}
