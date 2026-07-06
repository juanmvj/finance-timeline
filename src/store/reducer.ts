import type { AppState } from '../types'
import type { AppAction } from './actions'

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'LOAD_STATE':
      return { ...action.payload, loading: false }

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
      }

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      }

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload.id),
        occurrenceOverrides: state.occurrenceOverrides.filter(
          (o) => o.transaction_id !== action.payload.id
        ),
      }

    case 'ADD_OCCURRENCE_OVERRIDE':
      return {
        ...state,
        occurrenceOverrides: [
          ...state.occurrenceOverrides.filter(
            (o) =>
              !(o.transaction_id === action.payload.transaction_id &&
                o.occurrence_date === action.payload.occurrence_date)
          ),
          action.payload,
        ],
      }

    case 'REMOVE_OCCURRENCE_OVERRIDE':
      return {
        ...state,
        occurrenceOverrides: state.occurrenceOverrides.filter(
          (o) =>
            !(o.transaction_id === action.payload.transaction_id &&
              o.occurrence_date === action.payload.occurrence_date)
        ),
      }

    case 'ADD_DEBT':
      return {
        ...state,
        debts: [...state.debts, action.payload],
      }

    case 'UPDATE_DEBT':
      return {
        ...state,
        debts: state.debts.map((d) =>
          d.id === action.payload.id ? action.payload : d
        ),
      }

    case 'DELETE_DEBT':
      return {
        ...state,
        debts: state.debts.filter((d) => d.id !== action.payload.id),
        debtPayments: state.debtPayments.filter((p) => p.debt_id !== action.payload.id),
      }

    case 'ADD_DEBT_PAYMENT':
      return {
        ...state,
        debtPayments: [...state.debtPayments, action.payload],
        debts: state.debts.map((d) =>
          d.id === action.payload.debt_id
            ? { ...d, current_balance: d.current_balance - action.payload.amount }
            : d
        ),
      }

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      }

    case 'IMPORT_STATE':
      return { ...action.payload, loading: false }

    default:
      return state
  }
}
