const API_URL = '/api'

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

export async function getCurrentUser() {
  const response = await fetch(`${API_URL}/auth/me`, {
    credentials: 'include',
  })

  if (response.status === 401) return null

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Something went wrong.')
  }

  return result.user
}

export async function logout() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.error || 'Something went wrong.')
  }

  return result
}