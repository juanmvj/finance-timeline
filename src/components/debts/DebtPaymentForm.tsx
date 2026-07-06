import { useState } from 'react'
import { Modal } from '../shared/Modal'
import { todayString } from '../../lib/dates'

interface DebtPaymentFormProps {
  open: boolean
  onClose: () => void
  debtName: string
  onSubmit: (amount: number, date: string) => void
}

export function DebtPaymentForm({ open, onClose, debtName, onSubmit }: DebtPaymentFormProps) {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(todayString())

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsed = parseFloat(amount)
    if (isNaN(parsed) || parsed <= 0) return
    onSubmit(Math.round(parsed * 100) / 100, date)
    setAmount('')
    setDate(todayString())
    onClose()
  }

  const inputClass = 'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'

  return (
    <Modal open={open} onClose={onClose} title={`Payment — ${debtName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <input
            type="number"
            required
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded">
            Record Payment
          </button>
        </div>
      </form>
    </Modal>
  )
}
