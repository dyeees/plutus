const API_URL = 'http://localhost:4000/api'

type SignupData = {
  name: string
  email: string
  password: string
}

type LoginData = {
  email: string
  password: string
}

export async function signup(data: SignupData) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
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

export async function login(data: LoginData) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
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