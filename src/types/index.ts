export type UUID = string

export type TransactionType = 'income' | 'expense'

export type RecurrenceFrequency = 'one-time' | 'weekly' | 'biweekly' | 'monthly' | 'yearly'

export interface Transaction {
  id: UUID
  user_id: UUID
  name: string
  amount: number
  type: TransactionType
  date: string // ISO date YYYY-MM-DD
  recurrence: RecurrenceFrequency
  recurrence_end_date?: string | null
  linked_debt_id?: UUID | null
  created_at: string
  updated_at: string
}

export interface OccurrenceOverride {
  id: UUID
  user_id: UUID
  transaction_id: UUID
  occurrence_date: string // the original computed date being overridden
  deleted: boolean
  override_name?: string | null
  override_amount?: number | null
  override_type?: TransactionType | null
  override_date?: string | null // allows moving a single occurrence
}

/** Computed at render time, never persisted */
export interface TransactionOccurrence {
  transactionId: UUID
  transaction: Transaction
  date: string
  name: string
  amount: number
  type: TransactionType
  isOverridden: boolean
  isRecurring: boolean
}

export interface Debt {
  id: UUID
  user_id: UUID
  name: string
  original_amount: number
  current_balance: number
  interest_rate?: number | null // annual rate as decimal (0.05 = 5%)
  minimum_payment: number
  due_date: string
  linked_transaction_id?: UUID | null
  created_at: string
  updated_at: string
}

export interface DebtPayment {
  id: UUID
  user_id: UUID
  debt_id: UUID
  amount: number
  date: string
  created_at: string
}

export interface UserSettings {
  user_id: UUID
  current_balance: number
  balance_as_of_date: string
  forecast_days: 30 | 60 | 90
  minimum_safe_balance: number
}

export interface AppState {
  transactions: Transaction[]
  occurrenceOverrides: OccurrenceOverride[]
  debts: Debt[]
  debtPayments: DebtPayment[]
  settings: UserSettings
  loading: boolean
}

export const DEFAULT_SETTINGS: Omit<UserSettings, 'user_id'> = {
  current_balance: 0,
  balance_as_of_date: new Date().toISOString().split('T')[0],
  forecast_days: 30,
  minimum_safe_balance: 0,
}
