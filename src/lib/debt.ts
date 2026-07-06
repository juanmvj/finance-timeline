import { addMonths, format } from 'date-fns'
import type { Debt } from '../types'

export interface PayoffProjectionPoint {
  month: number
  date: string
  remainingBalance: number
  interestPaid: number
  principalPaid: number
}

export interface PayoffResult {
  points: PayoffProjectionPoint[]
  payoffDate: string | null // null if never pays off
  totalInterest: number
  neverPaysOff: boolean
}

export function calculatePayoff(debt: Debt): PayoffResult {
  const points: PayoffProjectionPoint[] = []
  let balance = debt.current_balance
  let cumulativeInterest = 0
  let cumulativePrincipal = 0
  let month = 0
  const startDate = new Date()
  let neverPaysOff = false

  // Initial point
  points.push({
    month: 0,
    date: format(startDate, 'yyyy-MM-dd'),
    remainingBalance: balance,
    interestPaid: 0,
    principalPaid: 0,
  })

  if (!debt.interest_rate || debt.interest_rate === 0) {
    while (balance > 0 && month < 600) {
      month++
      const payment = Math.min(debt.minimum_payment, balance)
      balance -= payment
      cumulativePrincipal += payment
      points.push({
        month,
        date: format(addMonths(startDate, month), 'yyyy-MM-dd'),
        remainingBalance: Math.max(0, Math.round(balance * 100) / 100),
        interestPaid: 0,
        principalPaid: Math.round(cumulativePrincipal * 100) / 100,
      })
    }
  } else {
    const monthlyRate = debt.interest_rate / 12

    while (balance > 0.01 && month < 600) {
      month++
      const interestCharge = balance * monthlyRate
      const payment = Math.min(debt.minimum_payment, balance + interestCharge)
      const principalPayment = payment - interestCharge

      if (principalPayment <= 0) {
        neverPaysOff = true
        break
      }

      balance -= principalPayment
      cumulativeInterest += interestCharge
      cumulativePrincipal += principalPayment

      points.push({
        month,
        date: format(addMonths(startDate, month), 'yyyy-MM-dd'),
        remainingBalance: Math.max(0, Math.round(balance * 100) / 100),
        interestPaid: Math.round(cumulativeInterest * 100) / 100,
        principalPaid: Math.round(cumulativePrincipal * 100) / 100,
      })
    }
  }

  const lastPoint = points[points.length - 1]
  return {
    points,
    payoffDate: neverPaysOff ? null : lastPoint.date,
    totalInterest: Math.round(cumulativeInterest * 100) / 100,
    neverPaysOff,
  }
}
