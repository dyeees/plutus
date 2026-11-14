
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
        COALESCE(bo.status, 'pending') AS status,
        bo.paid_at AS paidAt,
        bo.id AS occurrenceId,
        bo.occurrence_number AS occurrenceNumber
      FROM bills b
      LEFT JOIN bill_occurrences bo ON bo.bill_id = b.id
      WHERE b.user_id = ?
      ORDER BY COALESCE(bo.due_date, b.due_date) DESC, b.id DESC`,
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

billsRouter.patch('/:billId/occurrences/:occurrenceId', async (req, res) => {
  try {
    if (!req.session.user) {
      res.status(401).json({
        error: 'Not authenticated.',
      })
      return
    }

    const billId = Number(req.params.billId)
    const occurrenceId = Number(req.params.occurrenceId)
    const { amount } = req.body

    if (!Number.isInteger(billId) || billId <= 0 ||
        !Number.isInteger(occurrenceId) || occurrenceId <= 0) {
      res.status(400).json({
        error: 'Invalid bill or occurrence ID.',
      })
      return
    }

    if (amount === undefined ||
        !Number.isFinite(Number(amount)) ||
        Number(amount) < 0) {
      res.status(400).json({
        error: 'A valid amount is required.',
      })
      return
    }

    const [occurrenceRows] = await pool.execute(
      `SELECT bo.id, bo.status
       FROM bill_occurrences bo
       INNER JOIN bills b ON b.id = bo.bill_id
       WHERE bo.id = ?
         AND bo.bill_id = ?
         AND b.user_id = ?`,
      [occurrenceId, billId, req.session.user.id],
    )

    const occurrence = (occurrenceRows as any[])[0]

    if (!occurrence) {
      res.status(404).json({
        error: 'Occurrence not found.',
      })
      return
    }

    if (occurrence.status !== 'upcoming') {
      res.status(409).json({
        error: 'Only upcoming occurrences can receive an amount.',
      })
      return
    }

    await pool.execute(
      `UPDATE bill_occurrences
       SET amount_due = ?, status = 'pending'
       WHERE id = ?`,
      [Number(amount), occurrenceId],
    )

    res.json({
      message: 'Amount saved.',
      occurrenceId,
      amount: Number(amount),
      status: 'pending',
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: 'Internal server error',
    })
  }
})

billsRouter.post('/:billId/occurrences/:occurrenceId/pay', async (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ error: 'Not authenticated.' })
    return
  }

  const billId = Number(req.params.billId)
  const occurrenceId = Number(req.params.occurrenceId)

  const connection = await pool.getConnection()

  try {
    await connection.beginTransaction()

    const [rows] = await connection.execute(
      `SELECT bo.status, bo.occurrence_number, b.recurrence
       FROM bill_occurrences bo
       INNER JOIN bills b ON b.id = bo.bill_id
       WHERE bo.id = ? AND bo.bill_id = ? AND b.user_id = ?
       FOR UPDATE`,
      [occurrenceId, billId, req.session.user.id],
    )

    const occurrence = (rows as any[])[0]

    if (!occurrence) {
      await connection.rollback()
      res.status(404).json({ error: 'Occurrence not found.' })
      return
    }

    if (occurrence.status === 'paid') {
      await connection.execute(
        `UPDATE bill_occurrences SET status = 'pending', paid_at = NULL WHERE id = ?`,
        [occurrenceId],
      )

      await connection.execute(
        `DELETE FROM bill_occurrences
         WHERE bill_id = ? AND occurrence_number = ? + 1 AND status = 'upcoming'`,
        [billId, occurrence.occurrence_number],
      )

      await connection.commit()
      res.json({ action: 'unpaid', occurrenceId, nextOccurrenceNumber: occurrence.occurrence_number + 1 })
    } else {
      await connection.execute(
        `UPDATE bill_occurrences SET status = 'paid', paid_at = NOW() WHERE id = ?`,
        [occurrenceId],
      )

      let newOccurrence: any = null
      if (occurrence.recurrence !== 'One-time') {
        const [insertRes]: any = await connection.execute(
          `INSERT INTO bill_occurrences
             (bill_id, occurrence_number, due_date, amount_due, status)
           SELECT ?, COALESCE(MAX(occurrence_number), 0) + 1,
             CASE ?
               WHEN 'Weekly'     THEN DATE_ADD(MAX(due_date), INTERVAL 7 DAY)
               WHEN 'Bi-weekly'  THEN DATE_ADD(MAX(due_date), INTERVAL 14 DAY)
               WHEN 'Monthly'    THEN DATE_ADD(MAX(due_date), INTERVAL 1 MONTH)
               WHEN 'Quarterly'  THEN DATE_ADD(MAX(due_date), INTERVAL 3 MONTH)
               WHEN 'Semiannual' THEN DATE_ADD(MAX(due_date), INTERVAL 6 MONTH)
               WHEN 'Annually'   THEN DATE_ADD(MAX(due_date), INTERVAL 1 YEAR)
             END,
             NULL, 'upcoming'
           FROM bill_occurrences
           WHERE bill_id = ?`,
          [billId, occurrence.recurrence, billId],
        )

        const [createdRows]: any = await connection.execute(
          `SELECT id AS occurrenceId, occurrence_number AS occurrenceNumber, due_date AS dueDate, amount_due AS amount, status
           FROM bill_occurrences WHERE id = ?`,
          [insertRes.insertId],
        )
        newOccurrence = createdRows[0]
      }

      await connection.commit()
      res.json({ action: 'paid', occurrenceId, newOccurrence })
    }
  } catch (error) {
    await connection.rollback()
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    connection.release()
  }
})

billsRouter.post('/:billId/occurrences/:occurrenceId/unpay', async (req, res) => {
  if (!req.session.user) {
    res.status(401).json({ error: 'Not authenticated.' })
    return
  }

  const billId = Number(req.params.billId)
  const occurrenceId = Number(req.params.occurrenceId)

  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    const [rows] = await connection.execute(
      `SELECT bo.occurrence_number
       FROM bill_occurrences bo
       INNER JOIN bills b ON b.id = bo.bill_id
       WHERE bo.id = ? AND bo.bill_id = ? AND b.user_id = ? AND bo.status = 'paid'
       FOR UPDATE`,
      [occurrenceId, billId, req.session.user.id],
    )

    const occurrence = (rows as any[])[0]
    if (!occurrence) {
      await connection.rollback()
      res.status(404).json({ error: 'Paid occurrence not found.' })
      return
    }

    await connection.execute(
      `UPDATE bill_occurrences SET status = 'pending', paid_at = NULL WHERE id = ?`,
      [occurrenceId],
    )

    await connection.execute(
      `DELETE FROM bill_occurrences
       WHERE bill_id = ?
         AND occurrence_number = ? + 1
         AND status = 'upcoming'`,
      [billId, occurrence.occurrence_number],
    )

    await connection.commit()
    res.json({ message: 'Occurrence marked as unpaid.', occurrenceId, status: 'pending' })
  } catch (error) {
    await connection.rollback()
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    connection.release()
  }
})