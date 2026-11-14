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

export async function getLoans() {
  const response = await fetch(`${API_URL}/loans`, {
    credentials: 'include',
  })

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch loans.')
  }

  return result
}

export async function getLoanInstallments(loanId: number) {
  const response = await fetch(
    `${API_URL}/loans/${loanId}/installments`,
    {
      credentials: 'include',
    },
  )

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch loan installments.')
  }

  return result
}

export async function payLoanInstallment(
  loanId: number,
  installmentId: number,
) {
  const response = await fetch(
    `/api/loans/${loanId}/installments/${installmentId}/pay`,
    {
      method: 'POST',
      credentials: 'include',
    },
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Failed to pay installment.')
  }

  return result
}

export async function unpayLoanInstallment(loanId: number, installmentId: number) {
  const response = await fetch(`${API_URL}/loans/${loanId}/installments/${installmentId}/unpay`, {
    method: 'POST',
    credentials: 'include',
  })
  const result = await response.json()
  if (!response.ok) throw new Error(result.error || 'Failed to unpay installment.')
  return result
}