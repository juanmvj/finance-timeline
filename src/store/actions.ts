import type { AppState, Debt, DebtPayment, OccurrenceOverride, Transaction, UserSettings, UUID } from '../types'

export type AppAction =
  // Data loading
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_STATE'; payload: Omit<AppState, 'loading'> }

  // Transactions
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: { id: UUID } }

  // Occurrence overrides
  | { type: 'ADD_OCCURRENCE_OVERRIDE'; payload: OccurrenceOverride }
  | { type: 'REMOVE_OCCURRENCE_OVERRIDE'; payload: { transaction_id: UUID; occurrence_date: string } }

  // Debts
  | { type: 'ADD_DEBT'; payload: Debt }
  | { type: 'UPDATE_DEBT'; payload: Debt }
  | { type: 'DELETE_DEBT'; payload: { id: UUID } }

  // Debt payments
  | { type: 'ADD_DEBT_PAYMENT'; payload: DebtPayment }

  // Settings
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }

  // Import
  | { type: 'IMPORT_STATE'; payload: Omit<AppState, 'loading'> }
