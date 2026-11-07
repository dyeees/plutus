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