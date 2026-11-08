type LoanInput = {
  principalAmount: number
  interestRate: number
  durationMonths: number
}

export function calculateLoan({
  principalAmount,
  interestRate,
  durationMonths,
}: LoanInput) {
  const totalInterest =
    principalAmount * (interestRate / 100) * durationMonths

  const totalRepayment = principalAmount + totalInterest

  return {
    totalInterest,
    totalRepayment,
  }
}