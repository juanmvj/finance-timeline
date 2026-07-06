import { useCallback } from 'react'
import { useAppContext } from '../store/AppContext'
import { supabase } from '../lib/supabase'
import { generateId } from '../lib/id'
import type { Debt, DebtPayment, UUID } from '../types'

interface DebtInput {
  name: string
  original_amount: number
  current_balance: number
  interest_rate: number | null
  minimum_payment: number
  due_date: string
}

export function useDebts() {
  const { state, dispatch, user } = useAppContext()

  const addDebt = useCallback(async (input: DebtInput) => {
    if (!user) return
    const now = new Date().toISOString()
    const debt: Debt = {
      id: generateId(),
      user_id: user.id,
      ...input,
      linked_transaction_id: null,
      created_at: now,
      updated_at: now,
    }
    dispatch({ type: 'ADD_DEBT', payload: debt })
    await supabase.from('debts').insert(debt)
    return debt
  }, [dispatch, user])

  const updateDebt = useCallback(async (debt: Debt) => {
    const updated = { ...debt, updated_at: new Date().toISOString() }
    dispatch({ type: 'UPDATE_DEBT', payload: updated })
    await supabase.from('debts').update(updated).eq('id', debt.id)
  }, [dispatch])

  const deleteDebt = useCallback(async (id: UUID) => {
    dispatch({ type: 'DELETE_DEBT', payload: { id } })
    await supabase.from('debts').delete().eq('id', id)
  }, [dispatch])

  const addPayment = useCallback(async (debtId: UUID, amount: number, date: string) => {
    if (!user) return
    const payment: DebtPayment = {
      id: generateId(),
      user_id: user.id,
      debt_id: debtId,
      amount,
      date,
      created_at: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_DEBT_PAYMENT', payload: payment })
    await supabase.from('debt_payments').insert(payment)

    // Update the debt's current balance in Supabase
    const debt = state.debts.find((d) => d.id === debtId)
    if (debt) {
      const newBalance = debt.current_balance - amount
      await supabase.from('debts').update({
        current_balance: newBalance,
        updated_at: new Date().toISOString(),
      }).eq('id', debtId)
    }

    return payment
  }, [dispatch, user, state.debts])

  return {
    debts: state.debts,
    debtPayments: state.debtPayments,
    addDebt,
    updateDebt,
    deleteDebt,
    addPayment,
  }
}
