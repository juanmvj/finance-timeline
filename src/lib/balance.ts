import { addDays, eachDayOfInterval } from 'date-fns'
import { toDateString } from './dates'
import { generateAllOccurrences } from './recurrence'
import type { Transaction, OccurrenceOverride, TransactionOccurrence } from '../types'

export interface BalancePoint {
  date: string
  balance: number
  items: TransactionOccurrence[]
}

export interface BalanceWarning {
  date: string
  balance: number
  type: 'negative' | 'below-minimum'
}

export function projectBalance(
  startingBalance: number,
  balanceAsOfDate: Date,
  forecastDays: number,
  transactions: Transaction[],
  overrides: OccurrenceOverride[],
  minimumSafeBalance: number
): { points: BalancePoint[]; warnings: BalanceWarning[] } {
  const rangeEnd = addDays(balanceAsOfDate, forecastDays)

  const allOccurrences = generateAllOccurrences(
    transactions,
    balanceAsOfDate,
    rangeEnd,
    overrides
  )

  // Group by date
  const byDate = new Map<string, TransactionOccurrence[]>()
  for (const occ of allOccurrences) {
    const list = byDate.get(occ.date) ?? []
    list.push(occ)
    byDate.set(occ.date, list)
  }

  const points: BalancePoint[] = []
  const warnings: BalanceWarning[] = []
  let balance = startingBalance

  const days = eachDayOfInterval({ start: balanceAsOfDate, end: rangeEnd })
  for (const day of days) {
    const dateStr = toDateString(day)
    const items = byDate.get(dateStr) ?? []

    for (const item of items) {
      if (item.type === 'income') {
        balance += item.amount
      } else {
        balance -= item.amount
      }
    }

    points.push({ date: dateStr, balance: Math.round(balance * 100) / 100, items })

    if (balance < 0) {
      warnings.push({ date: dateStr, balance, type: 'negative' })
    } else if (balance < minimumSafeBalance) {
      warnings.push({ date: dateStr, balance, type: 'below-minimum' })
    }
  }

  return { points, warnings }
}
