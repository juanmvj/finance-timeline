import { useMemo } from 'react'
import { parseISO } from 'date-fns'
import { useAppContext } from '../store/AppContext'
import { projectBalance } from '../lib/balance'

export function useBalanceForecast() {
  const { state } = useAppContext()
  const { settings, transactions, occurrenceOverrides } = state

  return useMemo(
    () =>
      projectBalance(
        settings.current_balance,
        parseISO(settings.balance_as_of_date),
        settings.forecast_days,
        transactions,
        occurrenceOverrides,
        settings.minimum_safe_balance
      ),
    [
      settings.current_balance,
      settings.balance_as_of_date,
      settings.forecast_days,
      settings.minimum_safe_balance,
      transactions,
      occurrenceOverrides,
    ]
  )
}
