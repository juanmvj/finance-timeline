import { Modal } from './Modal'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  title: string
  message: string
  options: { label: string; value: string; variant?: 'danger' | 'default' }[]
  onSelect: (value: string) => void
}

export function ConfirmDialog({ open, onClose, title, message, options, onSelect }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-gray-600 mb-4">{message}</p>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`w-full px-4 py-2 rounded text-sm font-medium transition-colors ${
              opt.variant === 'danger'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
        <button
          onClick={onClose}
          className="w-full px-4 py-2 rounded text-sm text-gray-500 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}
