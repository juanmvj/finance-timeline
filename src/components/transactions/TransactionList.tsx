import { useState, useMemo } from 'react'
import type { Transaction } from '../../types'
import { formatDate } from '../../lib/dates'

type SortField = 'name' | 'amount' | 'date' | 'type' | 'recurrence'
type SortDir = 'asc' | 'desc'

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (tx: Transaction) => void
  onDelete: (tx: Transaction) => void
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const sorted = useMemo(() => {
    return [...transactions].sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'name':
          cmp = a.name.localeCompare(b.name)
          break
        case 'amount':
          cmp = a.amount - b.amount
          break
        case 'date':
          cmp = a.date.localeCompare(b.date)
          break
        case 'type':
          cmp = a.type.localeCompare(b.type)
          break
        case 'recurrence':
          cmp = a.recurrence.localeCompare(b.recurrence)
          break
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [transactions, sortField, sortDir])

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const arrow = (field: SortField) =>
    sortField === field ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''

  const thClass = 'px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none'

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-lg mb-1">No transactions yet</p>
        <p className="text-sm">Add your first transaction to get started.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className={thClass} onClick={() => handleSort('name')}>Name{arrow('name')}</th>
            <th className={thClass} onClick={() => handleSort('amount')}>Amount{arrow('amount')}</th>
            <th className={thClass} onClick={() => handleSort('type')}>Type{arrow('type')}</th>
            <th className={thClass} onClick={() => handleSort('date')}>Date{arrow('date')}</th>
            <th className={thClass} onClick={() => handleSort('recurrence')}>Recurrence{arrow('recurrence')}</th>
            <th className="px-3 py-2 w-20"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.map((tx) => (
            <tr key={tx.id} className="hover:bg-gray-50">
              <td className="px-3 py-2.5 font-medium text-gray-900">{tx.name}</td>
              <td className={`px-3 py-2.5 font-mono ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
              </td>
              <td className="px-3 py-2.5">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                  tx.type === 'income' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {tx.type}
                </span>
              </td>
              <td className="px-3 py-2.5 text-gray-600">{formatDate(tx.date)}</td>
              <td className="px-3 py-2.5 text-gray-600 capitalize">{tx.recurrence.replace('-', ' ')}</td>
              <td className="px-3 py-2.5">
                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit(tx)}
                    className="text-gray-400 hover:text-blue-600 p-1"
                    title="Edit"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(tx)}
                    className="text-gray-400 hover:text-red-600 p-1"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
