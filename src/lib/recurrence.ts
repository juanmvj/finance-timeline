import {
  addWeeks,
  addMonths,
  addYears,
  parseISO,
  startOfDay,
  differenceInWeeks,
  differenceInMonths,
  differenceInYears,
  isBefore,
} from 'date-fns'
import { toDateString } from './dates'
import type {
  Transaction,
  OccurrenceOverride,
  TransactionOccurrence,
  RecurrenceFrequency,
} from '../types'

function advanceDate(date: Date, frequency: RecurrenceFrequency): Date {
  switch (frequency) {
    case 'weekly':
      return addWeeks(date, 1)
    case 'biweekly':
      return addWeeks(date, 2)
    case 'monthly':
      return addMonths(date, 1)
    case 'yearly':
      return addYears(date, 1)
    default:
      throw new Error(`Cannot advance one-time transaction`)
  }
}

/** Jump forward to approximately rangeStart to avoid iterating from the transaction's creation date */
function jumpForward(txStart: Date, rangeStart: Date, frequency: RecurrenceFrequency): Date {
  if (!isBefore(txStart, rangeStart)) return txStart

  let periods: number
  switch (frequency) {
    case 'weekly':
      periods = Math.max(0, differenceInWeeks(rangeStart, txStart) - 1)
      return addWeeks(txStart, periods)
    case 'biweekly':
      periods = Math.max(0, Math.floor(differenceInWeeks(rangeStart, txStart) / 2) - 1)
      return addWeeks(txStart, periods * 2)
    case 'monthly':
      periods = Math.max(0, differenceInMonths(rangeStart, txStart) - 1)
      return addMonths(txStart, periods)
    case 'yearly':
      periods = Math.max(0, differenceInYears(rangeStart, txStart) - 1)
      return addYears(txStart, periods)
    default:
      return txStart
  }
}

function buildOccurrence(
  tx: Transaction,
  dateStr: string,
  override?: OccurrenceOverride
): TransactionOccurrence {
  return {
    transactionId: tx.id,
    transaction: tx,
    date: override?.override_date ?? dateStr,
    name: override?.override_name ?? tx.name,
    amount: override?.override_amount ?? tx.amount,
    type: override?.override_type ?? tx.type,
    isOverridden: !!override,
    isRecurring: tx.recurrence !== 'one-time',
  }
}

export function generateOccurrences(
  transaction: Transaction,
  rangeStart: Date,
  rangeEnd: Date,
  overrides: OccurrenceOverride[]
): TransactionOccurrence[] {
  const results: TransactionOccurrence[] = []
  const txStart = parseISO(transaction.date)
  const txEnd = transaction.recurrence_end_date
    ? parseISO(transaction.recurrence_end_date)
    : null

  // Build override lookup for this transaction
  const overrideMap = new Map<string, OccurrenceOverride>()
  for (const ov of overrides) {
    if (ov.transaction_id === transaction.id) {
      overrideMap.set(ov.occurrence_date, ov)
    }
  }

  const rangeStartDay = startOfDay(rangeStart)

  if (transaction.recurrence === 'one-time') {
    const dateStr = transaction.date
    if (txStart >= rangeStartDay && txStart <= rangeEnd) {
      const override = overrideMap.get(dateStr)
      if (!override?.deleted) {
        results.push(buildOccurrence(transaction, dateStr, override))
      }
    }
    return results
  }

  // Jump forward for performance
  let current = jumpForward(txStart, rangeStart, transaction.recurrence)

  while (current <= rangeEnd) {
    if (txEnd && current > txEnd) break

    const dateStr = toDateString(current)

    if (current >= rangeStartDay) {
      const override = overrideMap.get(dateStr)
      if (!override?.deleted) {
        results.push(buildOccurrence(transaction, dateStr, override))
      }
    }

    current = advanceDate(current, transaction.recurrence)
  }

  return results
}

export function generateAllOccurrences(
  transactions: Transaction[],
  rangeStart: Date,
  rangeEnd: Date,
  overrides: OccurrenceOverride[]
): TransactionOccurrence[] {
  const results: TransactionOccurrence[] = []
  for (const tx of transactions) {
    results.push(...generateOccurrences(tx, rangeStart, rangeEnd, overrides))
  }
  results.sort((a, b) => a.date.localeCompare(b.date))
  return results
}
