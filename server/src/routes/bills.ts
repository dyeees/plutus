
import { Router } from 'express'
import type { ResultSetHeader } from 'mysql2'
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
      `SELECT
        b.id,
        b.name,
        COALESCE(bo.amount_due, b.amount) AS amount,
        b.classification,
        b.recurrence,
        b.notes,
        COALESCE(bo.due_date, b.due_date) AS dueDate,
        bo.status,
        bo.paid_at AS paidAt,
        bo.occurrence_number AS occurrenceNumber
      FROM bills b
      LEFT JOIN bill_occurrences bo
        ON bo.bill_id = b.id
        AND bo.occurrence_number = (
          SELECT MIN(o.occurrence_number)
          FROM bill_occurrences o
          WHERE o.bill_id = b.id
            AND o.status <> 'paid'
        )
      WHERE b.user_id = ?
      ORDER BY b.id DESC`,
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

    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      const [result] = await connection.execute<ResultSetHeader>(
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

      await connection.execute(
        `INSERT INTO bill_occurrences
          (bill_id, occurrence_number, due_date, amount_due, status)
         VALUES (?, 1, ?, ?, 'upcoming')`,
        [result.insertId, dueDate, Number(amount)],
      )

      await connection.commit()

      res.status(201).json({
        message: 'Bill and occurrence saved successfully!',
        billId: result.insertId,
      })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Internal server error',
    })
  }
})
