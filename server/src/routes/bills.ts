
import { Router } from 'express'
import { pool } from '../db.js'

export const billsRouter = Router()

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
