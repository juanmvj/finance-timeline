import { useCallback } from 'react'
import { useAppContext } from '../store/AppContext'
import { supabase } from '../lib/supabase'
import { generateId } from '../lib/id'
import type { Transaction, OccurrenceOverride, RecurrenceFrequency, TransactionType, UUID } from '../types'

interface TransactionInput {
  name: string
  amount: number
  type: TransactionType
  date: string
  recurrence: RecurrenceFrequency
  recurrence_end_date?: string | null
  linked_debt_id?: UUID | null
}

export function useTransactions() {
  const { state, dispatch, user } = useAppContext()

  const addTransaction = useCallback(async (input: TransactionInput) => {
    if (!user) return
    const now = new Date().toISOString()
    const tx: Transaction = {
      id: generateId(),
      user_id: user.id,
      ...input,
      created_at: now,
      updated_at: now,
    }
    dispatch({ type: 'ADD_TRANSACTION', payload: tx })
    await supabase.from('transactions').insert(tx)
    return tx
  }, [dispatch, user])

  const updateTransaction = useCallback(async (tx: Transaction) => {
    const updated = { ...tx, updated_at: new Date().toISOString() }
    dispatch({ type: 'UPDATE_TRANSACTION', payload: updated })
    await supabase.from('transactions').update(updated).eq('id', tx.id)
  }, [dispatch])

  const deleteTransaction = useCallback(async (id: UUID) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: { id } })
    await supabase.from('transactions').delete().eq('id', id)
    await supabase.from('occurrence_overrides').delete().eq('transaction_id', id)
  }, [dispatch])

  const addOccurrenceOverride = useCallback(async (override: Omit<OccurrenceOverride, 'id' | 'user_id'>) => {
    if (!user) return
    const full: OccurrenceOverride = {
      id: generateId(),
      user_id: user.id,
      ...override,
    }
    dispatch({ type: 'ADD_OCCURRENCE_OVERRIDE', payload: full })
    await supabase.from('occurrence_overrides').upsert(full, {
      onConflict: 'transaction_id,occurrence_date',
    })
  }, [dispatch, user])

  const endSeriesAt = useCallback(async (tx: Transaction, beforeDate: string) => {
    // Set recurrence_end_date to the day before the given date
    const endDate = new Date(beforeDate)
    endDate.setDate(endDate.getDate() - 1)
    const updated = {
      ...tx,
      recurrence_end_date: endDate.toISOString().split('T')[0],
      updated_at: new Date().toISOString(),
    }
    dispatch({ type: 'UPDATE_TRANSACTION', payload: updated })
    await supabase.from('transactions').update(updated).eq('id', tx.id)
  }, [dispatch])

  return {
    transactions: state.transactions,
    overrides: state.occurrenceOverrides,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addOccurrenceOverride,
    endSeriesAt,
  }
}
