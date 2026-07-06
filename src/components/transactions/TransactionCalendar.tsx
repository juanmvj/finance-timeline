import { useState, useMemo } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from 'date-fns'
import { useOccurrences } from '../../hooks/useOccurrences'
import { toDateString } from '../../lib/dates'
import type { Transaction, TransactionOccurrence } from '../../types'

interface TransactionCalendarProps {
  onEditTransaction: (tx: Transaction) => void
  onDeleteTransaction: (tx: Transaction) => void
}

export function TransactionCalendar({ onEditTransaction, onDeleteTransaction }: TransactionCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const monthStart = useMemo(() => startOfMonth(currentMonth), [currentMonth])
  const monthEnd = useMemo(() => endOfMonth(currentMonth), [currentMonth])
  const calStart = useMemo(() => startOfWeek(monthStart), [monthStart])
  const calEnd = useMemo(() => endOfWeek(monthEnd), [monthEnd])

  const days = useMemo(() => eachDayOfInterval({ start: calStart, end: calEnd }), [calStart, calEnd])
  const occurrences = useOccurrences(calStart, calEnd)

  const occurrencesByDate = useMemo(() => {
    const map = new Map<string, TransactionOccurrence[]>()
    for (const occ of occurrences) {
      const list = map.get(occ.date) ?? []
      list.push(occ)
      map.set(occ.date, list)
    }
    return map
  }, [occurrences])

  const selectedOccurrences = selectedDay ? (occurrencesByDate.get(selectedDay) ?? []) : []

  return (
    <div className="p-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Today
          </button>
        </div>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 border-t border-l border-gray-200">
        {days.map((day) => {
          const dateStr = toDateString(day)
          const dayOccs = occurrencesByDate.get(dateStr) ?? []
          const inMonth = isSameMonth(day, currentMonth)
          const today = isToday(day)
          const isSelected = dateStr === selectedDay

          return (
            <div
              key={dateStr}
              onClick={() => setSelectedDay(isSelected ? null : dateStr)}
              className={`
                border-r border-b border-gray-200 min-h-[72px] p-1 cursor-pointer transition-colors
                ${inMonth ? 'bg-white' : 'bg-gray-50'}
                ${isSelected ? 'bg-blue-50 ring-1 ring-blue-300 ring-inset' : 'hover:bg-gray-50'}
              `}
            >
              <div className={`text-xs font-medium mb-0.5 ${
                today ? 'bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center' :
                inMonth ? 'text-gray-700' : 'text-gray-300'
              }`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-0.5">
                {dayOccs.slice(0, 3).map((occ, i) => (
                  <div
                    key={`${occ.transactionId}-${i}`}
                    className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate ${
                      occ.type === 'income'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {occ.name}
                  </div>
                ))}
                {dayOccs.length > 3 && (
                  <div className="text-[10px] text-gray-400 px-1">
                    +{dayOccs.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected day detail */}
      {selectedDay && (
        <div className="mt-4 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">
            {format(new Date(selectedDay + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}
          </h4>
          {selectedOccurrences.length === 0 ? (
            <p className="text-sm text-gray-400">No transactions on this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedOccurrences.map((occ, i) => (
                <div
                  key={`${occ.transactionId}-${i}`}
                  className="flex items-center justify-between py-1.5 px-2 rounded bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      occ.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-800">{occ.name}</span>
                    {occ.isRecurring && (
                      <span className="text-[10px] text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">recurring</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-mono ${
                      occ.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {occ.type === 'income' ? '+' : '-'}${occ.amount.toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); onEditTransaction(occ.transaction) }}
                      className="text-gray-400 hover:text-blue-600 p-1"
                      title="Edit series"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeleteTransaction(occ.transaction) }}
                      className="text-gray-400 hover:text-red-600 p-1"
                      title="Delete"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
