import { formatDate } from '../../lib/dates'
import type { TransactionOccurrence } from '../../types'

interface UpcomingItemsProps {
  occurrences: TransactionOccurrence[]
}

export function UpcomingItems({ occurrences }: UpcomingItemsProps) {
  if (occurrences.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Upcoming (7 days)</h3>
        <p className="text-sm text-gray-400">No upcoming transactions.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Upcoming (7 days)</h3>
      <div className="space-y-1.5">
        {occurrences.map((occ, i) => (
          <div key={`${occ.transactionId}-${occ.date}-${i}`} className="flex items-center justify-between py-1.5 px-2 rounded bg-gray-50 text-sm">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${occ.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-gray-800">{occ.name}</span>
              <span className="text-gray-400 text-xs">{formatDate(occ.date)}</span>
            </div>
            <span className={`font-mono ${occ.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {occ.type === 'income' ? '+' : '-'}${occ.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
