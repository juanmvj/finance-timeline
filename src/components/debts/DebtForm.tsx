import { useState, useEffect } from 'react'
import { Modal } from '../shared/Modal'
import { todayString } from '../../lib/dates'
import type { Debt } from '../../types'

interface DebtFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    original_amount: number
    current_balance: number
    interest_rate: number | null
    minimum_payment: number
    due_date: string
  }) => void
  initialData?: Debt | null
}

export function DebtForm({ open, onClose, onSubmit, initialData }: DebtFormProps) {
  const [name, setName] = useState('')
  const [originalAmount, setOriginalAmount] = useState('')
  const [currentBalance, setCurrentBalance] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [minimumPayment, setMinimumPayment] = useState('')
  const [dueDate, setDueDate] = useState(todayString())

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setOriginalAmount(String(initialData.original_amount))
      setCurrentBalance(String(initialData.current_balance))
      setInterestRate(initialData.interest_rate != null ? String(initialData.interest_rate * 100) : '')
      setMinimumPayment(String(initialData.minimum_payment))
      setDueDate(initialData.due_date)
    } else {
      setName('')
      setOriginalAmount('')
      setCurrentBalance('')
      setInterestRate('')
      setMinimumPayment('')
      setDueDate(todayString())
    }
  }, [initialData, open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const oa = parseFloat(originalAmount)
    const cb = parseFloat(currentBalance)
    const mp = parseFloat(minimumPayment)
    const ir = interestRate ? parseFloat(interestRate) / 100 : null
    if (!name.trim() || isNaN(oa) || isNaN(cb) || isNaN(mp)) return
    onSubmit({
      name: name.trim(),
      original_amount: Math.round(oa * 100) / 100,
      current_balance: Math.round(cb * 100) / 100,
      interest_rate: ir,
      minimum_payment: Math.round(mp * 100) / 100,
      due_date: dueDate,
    })
    onClose()
  }

  const inputClass = 'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Debt' : 'Add Debt'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Student Loan, Credit Card"
            className={inputClass}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Original Amount</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={originalAmount}
              onChange={(e) => setOriginalAmount(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Current Balance</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={currentBalance}
              onChange={(e) => setCurrentBalance(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Interest Rate % (optional)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="e.g. 5.5"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Minimum Payment</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={minimumPayment}
              onChange={(e) => setMinimumPayment(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Due Date</label>
          <input
            type="date"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded">
            {initialData ? 'Save' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
