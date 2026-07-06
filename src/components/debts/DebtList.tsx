import { useMemo } from 'react'
import { calculatePayoff } from '../../lib/debt'
import { formatDate } from '../../lib/dates'
import { DebtPayoffChart } from './DebtPayoffChart'
import type { Debt, DebtPayment } from '../../types'

interface DebtListProps {
  debts: Debt[]
  payments: DebtPayment[]
  onEdit: (debt: Debt) => void
  onDelete: (debt: Debt) => void
  onAddPayment: (debt: Debt) => void
}

export function DebtList({ debts, payments, onEdit, onDelete, onAddPayment }: DebtListProps) {
  if (debts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg mb-1">No debts tracked</p>
        <p className="text-sm">Add a debt to start tracking payoff.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {debts.map((debt) => (
        <DebtCard
          key={debt.id}
          debt={debt}
          payments={payments.filter((p) => p.debt_id === debt.id)}
          onEdit={() => onEdit(debt)}
          onDelete={() => onDelete(debt)}
          onAddPayment={() => onAddPayment(debt)}
        />
      ))}
    </div>
  )
}

function DebtCard({
  debt,
  payments,
  onEdit,
  onDelete,
  onAddPayment,
}: {
  debt: Debt
  payments: DebtPayment[]
  onEdit: () => void
  onDelete: () => void
  onAddPayment: () => void
}) {
  const payoff = useMemo(() => calculatePayoff(debt), [debt])
  const paidPercent = Math.max(0, Math.min(100, ((debt.original_amount - debt.current_balance) / debt.original_amount) * 100))

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{debt.name}</h3>
          <p className="text-sm text-gray-500">
            Due {formatDate(debt.due_date)}
            {debt.interest_rate != null && ` · ${(debt.interest_rate * 100).toFixed(1)}% APR`}
          </p>
        </div>
        <div className="flex gap-1">
          <button onClick={onEdit} className="text-gray-400 hover:text-blue-600 p-1" title="Edit">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button onClick={onDelete} className="text-gray-400 hover:text-red-600 p-1" title="Delete">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Balance and progress */}
      <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
        <div>
          <p className="text-gray-500">Remaining</p>
          <p className="font-mono font-semibold text-gray-900">${debt.current_balance.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500">Original</p>
          <p className="font-mono text-gray-600">${debt.original_amount.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-500">Payment</p>
          <p className="font-mono text-gray-600">${debt.minimum_payment.toFixed(2)}/mo</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all"
          style={{ width: `${paidPercent}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mb-3">{paidPercent.toFixed(0)}% paid off</p>

      {/* Payoff projection */}
      {payoff.neverPaysOff ? (
        <div className="text-sm text-red-600 bg-red-50 rounded p-2 mb-3">
          At current payment rate, this debt will never be paid off. Payment doesn't cover monthly interest.
        </div>
      ) : (
        <p className="text-sm text-gray-600 mb-3">
          Estimated payoff: <strong>{formatDate(payoff.payoffDate!)}</strong>
          {payoff.totalInterest > 0 && ` · Total interest: $${payoff.totalInterest.toFixed(2)}`}
        </p>
      )}

      <DebtPayoffChart points={payoff.points} />

      {/* Payment history */}
      {payments.length > 0 && (
        <details className="mt-3">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            Payment history ({payments.length})
          </summary>
          <div className="mt-2 space-y-1">
            {[...payments].sort((a, b) => b.date.localeCompare(a.date)).map((p) => (
              <div key={p.id} className="flex justify-between text-sm py-1 px-2 bg-gray-50 rounded">
                <span className="text-gray-600">{formatDate(p.date)}</span>
                <span className="font-mono text-green-600">-${p.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </details>
      )}

      <button
        onClick={onAddPayment}
        className="mt-3 w-full py-1.5 text-sm font-medium text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
      >
        + Record Payment
      </button>
    </div>
  )
}
