type InstallmentInput = {
  totalRepayment: number
  firstDueDate: string
  durationMonths: number
  recurrence: string
}

export function generateInstallments({
  totalRepayment,
  firstDueDate,
  durationMonths,
  recurrence,
}: InstallmentInput) {
  const intervals: Record<string, { days?: number; months?: number }> = {
    'One-time': { months: 0 },
    Monthly: { months: 1 },
    'Bi-weekly': { days: 14 },
    Weekly: { days: 7 },
    Quarterly: { months: 3 },
    Semiannual: { months: 6 },
    Annually: { months: 12 },
  }

  const interval = intervals[recurrence]

  if (!interval) {
    throw new Error('Invalid payment frequency.')
  }

  const [year, month, day] = firstDueDate.split('-').map(Number)
    if (year === undefined || month === undefined || day === undefined) {
    throw new Error('Invalid first due date.')
  }

  const startDate = new Date(Date.UTC(year, month - 1, day))
  const endDate = new Date(Date.UTC(year, month - 1 + durationMonths, day))

  const dates: string[] = []

  const addMonths = (date: Date, months: number) => {
    const targetMonth = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth() + months,
      1,
    ))

    const lastDay = new Date(Date.UTC(
      targetMonth.getUTCFullYear(),
      targetMonth.getUTCMonth() + 1,
      0,
    )).getUTCDate()

    targetMonth.setUTCDate(Math.min(day, lastDay))

    return targetMonth
  }

  for (let i = 0; ; i++) {
    let dueDate: Date

    if (recurrence === 'One-time') {
      dueDate = startDate
    } else if (interval.days) {
      dueDate = new Date(startDate)
      dueDate.setUTCDate(dueDate.getUTCDate() + i * interval.days)
    } else {
      dueDate = addMonths(startDate, i * (interval.months ?? 0))
    }

    if (dueDate >= endDate) break
    dates.push(dueDate.toISOString().slice(0, 10))
    if (recurrence === 'One-time') break
  }

  const totalCents = Math.round(totalRepayment * 100)
  const regularCents = Math.floor(totalCents / dates.length)

  return dates.map((dueDate, index) => ({
    installmentNumber: index + 1,
    dueDate,
    amountDue:
      index === dates.length - 1
        ? (totalCents - regularCents * (dates.length - 1)) / 100
        : regularCents / 100,
  }))
}