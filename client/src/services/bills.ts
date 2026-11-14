const API_URL = '/api'

type BillData = {
  name: string
  amount: number
  classification: string
  dueDate: string
  recurrence: string
  notes: string
}

export async function saveBill(data: BillData) {
  const response = await fetch(`${API_URL}/bills`, {
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

export async function getBills() {
  const response = await fetch(`${API_URL}/bills`, {
    credentials: 'include',
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Failed to fetch bills.')
  }

  return result
}

export async function setBillOccurrenceAmount(
  billId: number,
  occurrenceId: number,
  amount: number,
) {
  const response = await fetch(
    `/api/bills/${billId}/occurrences/${occurrenceId}`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    },
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Failed to save amount.')
  }

  return result
}

export async function payBillOccurrence(
  billId: number,
  occurrenceId: number,
) {
  const response = await fetch(
    `/api/bills/${billId}/occurrences/${occurrenceId}/pay`,
    {
      method: 'POST',
      credentials: 'include',
    },
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Failed to pay occurrence.')
  }

  return result
}