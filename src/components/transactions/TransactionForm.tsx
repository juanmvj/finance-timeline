import { useState, useEffect } from 'react'
import { Modal } from '../shared/Modal'
import { todayString } from '../../lib/dates'
import type { Transaction, TransactionType, RecurrenceFrequency } from '../../types'

interface TransactionFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    amount: number
    type: TransactionType
    date: string
    recurrence: RecurrenceFrequency
    recurrence_end_date: string | null
  }) => void
  initialData?: Transaction | null
}

const RECURRENCE_OPTIONS: { value: RecurrenceFrequency; label: string }[] = [
  { value: 'one-time', label: 'One time' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
]

export function TransactionForm({ open, onClose, onSubmit, initialData }: TransactionFormProps) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [date, setDate] = useState(todayString())
  const [recurrence, setRecurrence] = useState<RecurrenceFrequency>('one-time')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setAmount(String(initialData.amount))
      setType(initialData.type)
      setDate(initialData.date)
      setRecurrence(initialData.recurrence)
      setEndDate(initialData.recurrence_end_date ?? '')
    } else {
      setName('')
      setAmount('')
      setType('expense')
      setDate(todayString())
      setRecurrence('one-time')
      setEndDate('')
    }
  }, [initialData, open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = parseFloat(amount)
    if (!name.trim() || isNaN(parsed) || parsed <= 0) return
    onSubmit({
      name: name.trim(),
      amount: Math.round(parsed * 100) / 100,
      type,
      date,
      recurrence,
      recurrence_end_date: endDate || null,
    })
    onClose()
  }

  const inputClass = 'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <Modal open={open} onClose={onClose} title={initialData ? 'Edit Transaction' : 'Add Transaction'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rent, Salary"
            className={inputClass}
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Amount</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className={inputClass}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Recurrence</label>
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value as RecurrenceFrequency)}
            className={inputClass}
          >
            {RECURRENCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {recurrence !== 'one-time' && (
          <div>
            <label className={labelClass}>End date (optional)</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={date}
              className={inputClass}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
          >
            {initialData ? 'Save' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
