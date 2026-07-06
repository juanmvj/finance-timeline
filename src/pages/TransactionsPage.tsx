import { useState } from 'react'
import { useTransactions } from '../hooks/useTransactions'
import { TransactionForm } from '../components/transactions/TransactionForm'
import { TransactionList } from '../components/transactions/TransactionList'
import { TransactionCalendar } from '../components/transactions/TransactionCalendar'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import type { Transaction } from '../types'

type ViewMode = 'list' | 'calendar'

export function TransactionsPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions()
  const [formOpen, setFormOpen] = useState(false)
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  function handleEdit(tx: Transaction) {
    setEditingTx(tx)
    setFormOpen(true)
  }

  function handleDelete(tx: Transaction) {
    if (tx.recurrence === 'one-time') {
      deleteTransaction(tx.id)
    } else {
      setDeletingTx(tx)
    }
  }

  function handleDeleteChoice(choice: string) {
    if (!deletingTx) return
    if (choice === 'all') {
      deleteTransaction(deletingTx.id)
    }
    // "this-one" and "this-and-future" handled from calendar context
    // For list view, we only offer "entire series" delete
    setDeletingTx(null)
  }

  const btnBase = 'px-3 py-1.5 text-sm font-medium rounded transition-colors'
  const btnActive = 'bg-blue-600 text-white'
  const btnInactive = 'bg-gray-100 text-gray-600 hover:bg-gray-200'

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>

        <div className="flex items-center gap-2">
          <div className="flex rounded overflow-hidden border border-gray-200">
            <button
              onClick={() => setViewMode('list')}
              className={`${btnBase} ${viewMode === 'list' ? btnActive : btnInactive} rounded-none`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`${btnBase} ${viewMode === 'calendar' ? btnActive : btnInactive} rounded-none`}
            >
              Calendar
            </button>
          </div>

          <button
            onClick={() => { setEditingTx(null); setFormOpen(true) }}
            className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
          >
            + Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {viewMode === 'list' ? (
          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <TransactionCalendar
            onEditTransaction={handleEdit}
            onDeleteTransaction={handleDelete}
          />
        )}
      </div>

      <TransactionForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingTx(null) }}
        initialData={editingTx}
        onSubmit={async (data) => {
          if (editingTx) {
            await updateTransaction({ ...editingTx, ...data })
          } else {
            await addTransaction(data)
          }
        }}
      />

      <ConfirmDialog
        open={!!deletingTx}
        onClose={() => setDeletingTx(null)}
        title="Delete recurring transaction"
        message={`"${deletingTx?.name}" is a recurring transaction. What would you like to delete?`}
        options={[
          { label: 'Delete entire series', value: 'all', variant: 'danger' },
        ]}
        onSelect={handleDeleteChoice}
      />
    </div>
  )
}
