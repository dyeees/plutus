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

authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const normalizedEmail = email.trim().toLowerCase()

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({
        error: 'Email and password are required.',
      })
      return
    }

    const [rows] = await pool.execute(
      `SELECT id, name, email, password_hash
       FROM users
       WHERE email = ?
       LIMIT 1`,
      [normalizedEmail],
    )

    const users = rows as {
      id: number
      name: string
      email: string
      password_hash: string
    }[]

    if (users.length === 0) {
      res.status(401).json({
        error: 'Invalid email or password.',
      })
      return
    }

    const user = users[0]!

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash,
    )

    if (!isPasswordValid) {
      res.status(401).json({
        error: 'Invalid email or password.',
      })
      return
    }

    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Internal server error',
    })
  }
})