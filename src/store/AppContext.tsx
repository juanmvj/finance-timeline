import { createContext, useContext, useReducer, useEffect, useCallback, useState, type ReactNode } from 'react'
import type { AppState, UserSettings } from '../types'
import type { AppAction } from './actions'
import { appReducer } from './reducer'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

const DEFAULT_SETTINGS: Omit<UserSettings, 'user_id'> = {
  current_balance: 0,
  balance_as_of_date: new Date().toISOString().split('T')[0],
  forecast_days: 30,
  minimum_safe_balance: 0,
}

const initialState: AppState = {
  transactions: [],
  occurrenceOverrides: [],
  debts: [],
  debtPayments: [],
  settings: { user_id: '', ...DEFAULT_SETTINGS },
  loading: true,
}

interface AppContextValue {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  user: User | null
}

const AppContext = createContext<AppContextValue | null>(null)

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}

async function fetchUserData(userId: string): Promise<Omit<AppState, 'loading'>> {
  const [txRes, overrideRes, debtRes, paymentRes, settingsRes] = await Promise.all([
    supabase.from('transactions').select('*').eq('user_id', userId),
    supabase.from('occurrence_overrides').select('*').eq('user_id', userId),
    supabase.from('debts').select('*').eq('user_id', userId),
    supabase.from('debt_payments').select('*').eq('user_id', userId),
    supabase.from('user_settings').select('*').eq('user_id', userId).single(),
  ])

  return {
    transactions: txRes.data ?? [],
    occurrenceOverrides: overrideRes.data ?? [],
    debts: debtRes.data ?? [],
    debtPayments: paymentRes.data ?? [],
    settings: settingsRes.data ?? { user_id: userId, ...DEFAULT_SETTINGS },
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)
  const [user, setUser] = useState<User | null>(null)

  const loadData = useCallback(async (userId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    const data = await fetchUserData(userId)
    dispatch({ type: 'LOAD_STATE', payload: data })
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        loadData(currentUser.id)
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      if (currentUser) {
        loadData(currentUser.id)
      } else {
        const { loading: _, ...rest } = initialState
        dispatch({ type: 'LOAD_STATE', payload: rest })
      }
    })

    return () => subscription.unsubscribe()
  }, [loadData])

  return (
    <AppContext.Provider value={{ state, dispatch, user }}>
      {children}
    </AppContext.Provider>
  )
}
