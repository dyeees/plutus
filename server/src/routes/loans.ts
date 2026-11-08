import { Router } from 'express'
import { pool } from '../db.js'
import { calculateLoan } from '../utils/loanCalculations.js'

export const loansRouter = Router()

loansRouter.get('/', async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(401).json({
        error: 'Not authenticated.',
      })
      return
    }

    const [rows] = await pool.execute(
      `SELECT id, name,
              principal_amount AS principalAmount,
              interest_rate AS interestRate,
              duration_months AS durationMonths,
              total_interest AS totalInterest,
              total_repayment AS totalRepayment,
              installment_count AS installmentCount,
              first_due_date AS firstDueDate,
              recurrence, notes
      FROM loans
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

    const calculations = calculateLoan({
      principalAmount: Number(loanAmount),
      interestRate: Number(interestRate),
      durationMonths: Number(durationMonths),
      recurrence,
    })

    if (calculations.installmentCount <= 0) {
      res.status(400).json({
        error: 'Invalid payment frequency.',
      })
      return
    }

    await pool.execute(
      `INSERT INTO loans (
        user_id,
        name,
        principal_amount,
        interest_rate,
        duration_months,
        total_interest,
        total_repayment,
        installment_count,
        recurrence,
        first_due_date,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.session.user.id,
        name.trim(),
        Number(loanAmount),
        Number(interestRate),
        Number(durationMonths),
        calculations.totalInterest,
        calculations.totalRepayment,
        calculations.installmentCount,
        recurrence,
        dueDate,
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