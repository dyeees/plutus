import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../db.js'

export const authRouter = Router()

authRouter.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      res.status(400).json({
        error: 'Name, email, and password are required.',
      })
      return
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await pool.execute(
      `INSERT INTO users (name, email, password_hash)
       VALUES (?, ?, ?)`,
      [name, email, passwordHash],
    )

    res.status(201).json({
      message: 'Account created successfully!',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Internal server error',
    })
  }
})