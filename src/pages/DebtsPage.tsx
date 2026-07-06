import { useState } from 'react'
import { useDebts } from '../hooks/useDebts'
import { DebtForm } from '../components/debts/DebtForm'
import { DebtList } from '../components/debts/DebtList'
import { DebtPaymentForm } from '../components/debts/DebtPaymentForm'
import type { Debt } from '../types'

export function DebtsPage() {
  const { debts, debtPayments, addDebt, updateDebt, deleteDebt, addPayment } = useDebts()
  const [formOpen, setFormOpen] = useState(false)
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null)
  const [payingDebt, setPayingDebt] = useState<Debt | null>(null)

  const totalDebt = debts.reduce((sum, d) => sum + d.current_balance, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Debts</h2>
          {debts.length > 0 && (
            <p className="text-sm text-gray-500 mt-0.5">
              Total remaining: <span className="font-mono font-semibold text-gray-800">${totalDebt.toFixed(2)}</span>
            </p>
          )}
        </div>
        <button
          onClick={() => { setEditingDebt(null); setFormOpen(true) }}
          className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
        >
          + Add Debt
        </button>
      </div>

      <DebtList
        debts={debts}
        payments={debtPayments}
        onEdit={(debt) => { setEditingDebt(debt); setFormOpen(true) }}
        onDelete={(debt) => deleteDebt(debt.id)}
        onAddPayment={(debt) => setPayingDebt(debt)}
      />

      <DebtForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingDebt(null) }}
        initialData={editingDebt}
        onSubmit={async (data) => {
          if (editingDebt) {
            await updateDebt({ ...editingDebt, ...data })
          } else {
            await addDebt(data)
          }
        }}
      />

      <DebtPaymentForm
        open={!!payingDebt}
        onClose={() => setPayingDebt(null)}
        debtName={payingDebt?.name ?? ''}
        onSubmit={async (amount, date) => {
          if (payingDebt) {
            await addPayment(payingDebt.id, amount, date)
          }
        }}
      />
    </div>
  )
}
