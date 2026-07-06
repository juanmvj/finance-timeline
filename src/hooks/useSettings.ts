import { useCallback } from 'react'
import { useAppContext } from '../store/AppContext'
import { supabase } from '../lib/supabase'
import type { UserSettings } from '../types'

export function useSettings() {
  const { state, dispatch, user } = useAppContext()

  const updateSettings = useCallback(async (updates: Partial<UserSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: updates })
    if (user) {
      await supabase.from('user_settings').update(updates).eq('user_id', user.id)
    }
  }, [dispatch, user])

  return {
    settings: state.settings,
    updateSettings,
  }
}
