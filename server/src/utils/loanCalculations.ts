type LoanInput = {
  principalAmount: number
  interestRate: number
  durationMonths: number
  recurrence: string
}

export function calculateLoan({
  principalAmount,
  interestRate,
  durationMonths,
  recurrence,
}: LoanInput) {
  const totalInterest =
    principalAmount * (interestRate / 100) * durationMonths

  const totalRepayment = principalAmount + totalInterest

  const installmentCount = {
    'One-time': 1,
    Monthly: durationMonths,
    'Bi-weekly': durationMonths * 2,
    Weekly: durationMonths * 4,
    Quarterly: Math.ceil(durationMonths / 3),
    Semiannual: Math.ceil(durationMonths / 6),
    Annually: Math.ceil(durationMonths / 12),
  }[recurrence] ?? 0

  return {
    totalInterest,
    totalRepayment,
    installmentCount,
  }
}