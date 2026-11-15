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

  return `${month}-${day}-${year}`
}

export const formatCategory = {
  Housing: { label: 'Housing', color: '#C8860A', bg: 'rgba(200, 134, 10, 0.10)', border: 'rgba(200, 134, 10, 0.25)' },
  Utilities: { label: 'Utilities', color: '#0284C7', bg: 'rgba(2, 132, 199, 0.10)', border: 'rgba(2, 132, 199, 0.25)' },
  Subscriptions: { label: 'Subscriptions', color: '#7C3AED', bg: 'rgba(124, 58, 237, 0.10)', border: 'rgba(124, 58, 237, 0.25)' },
  Loans: { label: 'Loans', color: '#0F766E', bg: 'rgba(15, 118, 110, 0.10)', border: 'rgba(15, 118, 110, 0.25)' },
}