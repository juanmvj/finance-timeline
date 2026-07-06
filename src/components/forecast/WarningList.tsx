import { formatDate } from '../../lib/dates'
import type { BalanceWarning } from '../../lib/balance'

interface WarningListProps {
  warnings: BalanceWarning[]
}

export function WarningList({ warnings }: WarningListProps) {
  // Deduplicate: only show first occurrence of each warning type per consecutive run
  const deduped = warnings.reduce<BalanceWarning[]>((acc, w) => {
    const last = acc[acc.length - 1]
    if (last && last.type === w.type) return acc // skip consecutive same-type
    acc.push(w)
    return acc
  }, [])

  if (deduped.length === 0) return null

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Warnings</h3>
      <div className="space-y-2">
        {deduped.map((w) => (
          <div
            key={`${w.date}-${w.type}`}
            className={`flex items-start gap-2 p-2 rounded text-sm ${
              w.type === 'negative' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
            }`}
          >
            <span className="mt-0.5">
              {w.type === 'negative' ? '!!' : '!'}
            </span>
            <span>
              Balance goes {w.type === 'negative' ? 'negative' : 'below minimum'} on{' '}
              <strong>{formatDate(w.date)}</strong> — projected ${w.balance.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
