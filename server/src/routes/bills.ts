
import { Router } from 'express'
import { pool } from '../db.js'

export const billsRouter = Router()

billsRouter.get('/', async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(401).json({
        error: 'Not authenticated.',
      })
      return
    }

    const [rows] = await pool.execute(
      `SELECT id, name, amount, classification, due_date AS dueDate,
              recurrence, notes
       FROM bills
       WHERE user_id = ?
       ORDER BY id DESC`,
      [req.session.user.id],
    )

    res.json(rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Internal server error',
    })
  }
})

billsRouter.post('/', async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(401).json({
        error: 'Not authenticated.',
      })
      return
    }

    const {
      name,
      amount,
      classification,
      dueDate,
      recurrence,
      notes,
    } = req.body

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      amount === undefined ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) < 0 ||
      typeof classification !== 'string' ||
      typeof dueDate !== 'string' ||
      typeof recurrence !== 'string'
    ) {
      res.status(400).json({
        error: 'Invalid or missing bill information.',
      })
      return
    }

    const [result] = await pool.execute(
      `INSERT INTO bills
        (user_id, name, amount, classification, due_date, recurrence, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.session.user.id,
        name.trim(),
        Number(amount),
        classification,
        dueDate,
        recurrence,
        notes || null,
      ],
    )

    res.status(201).json({
      message: 'Bill saved successfully!',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Internal server error',
    })
  }
})
