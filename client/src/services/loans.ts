const API_URL = '/api'

type LoanData = {
  name: string
  loanAmount: number
  interestRate: number
  durationMonths: number
  dueDate: string
  recurrence: string
  notes: string
}

export async function saveLoan(data: LoanData) {
  const response = await fetch(`${API_URL}/loans`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Something went wrong.')
  }

  return result
}