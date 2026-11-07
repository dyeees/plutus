import { Router } from 'express'
import { pool } from '../db.js'

export const loansRouter = Router()

loansRouter.post('/', async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(401).json({
        error: 'Not authenticated.',
      })
      return
    }

    const {
      name,
      loanAmount,
      interestRate,
      durationMonths,
      dueDate,
      recurrence,
      notes,
    } = req.body

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      !Number.isFinite(Number(loanAmount)) ||
      Number(loanAmount) <= 0 ||
      !Number.isFinite(Number(interestRate)) ||
      Number(interestRate) < 0 ||
      !Number.isInteger(Number(durationMonths)) ||
      Number(durationMonths) <= 0 ||
      typeof dueDate !== 'string' ||
      typeof recurrence !== 'string'
    ) {
      res.status(400).json({
        error: 'Invalid or missing loan information.',
      })
      return
    }

    await pool.execute(
      `INSERT INTO loans
        (user_id, name, loan_amount, interest_rate, duration_months, due_date, recurrence, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.session.user.id,
        name.trim(),
        Number(loanAmount),
        Number(interestRate),
        Number(durationMonths),
        dueDate,
        recurrence,
        notes || null,
      ],
    )

    res.status(201).json({
      message: 'Loan saved successfully!',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Internal server error',
    })
  }
})