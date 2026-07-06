import { useMemo } from 'react'
import { useAppContext } from '../store/AppContext'
import { generateAllOccurrences } from '../lib/recurrence'

export function useOccurrences(rangeStart: Date, rangeEnd: Date) {
  const { state } = useAppContext()

  return useMemo(
    () =>
      generateAllOccurrences(
        state.transactions,
        rangeStart,
        rangeEnd,
        state.occurrenceOverrides
      ),
    [state.transactions, state.occurrenceOverrides, rangeStart.getTime(), rangeEnd.getTime()]
  )
}
