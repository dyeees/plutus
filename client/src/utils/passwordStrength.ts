export type PasswordStrength = {
  level: number
  label: string
  color: string
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { level: 0, label: '', color: '#E2DED4' }
  }

  let score = 0

  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) {
    return { level: 1, label: 'Weak', color: '#C0392B' }
  }

  if (score === 3) {
    return { level: 2, label: 'Fair', color: '#C8860A' }
  }

  if (score === 4) {
    return { level: 3, label: 'Good', color: '#4A8B68' }
  }

  return { level: 3, label: 'Strong', color: '#386D59' }
}
