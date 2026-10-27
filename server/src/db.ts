import mysql from 'mysql2/promise'
import { config } from './config.js'

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
  } finally {
    connection.release()
  }
}
