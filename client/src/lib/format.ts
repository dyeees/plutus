const PHP = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatMoney = (value: number) => PHP.format(value)

export function formatDate(value: unknown): string {
  if (!value) return '—'

  const iso =
    typeof value === 'string'
      ? value.slice(0, 10)
      : (value as Date).toISOString().slice(0, 10)

  const [year, month, day] = iso.split('-')

  if (!year || !month || !day) return String(value)

  return `${month}/${day}/${year}`
}