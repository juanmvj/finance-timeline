import { useRef } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useAppContext } from '../../store/AppContext'
import { supabase } from '../../lib/supabase'
import type { AppState } from '../../types'

export function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { user, state, dispatch } = useAppContext()
  const { signOut } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    const { loading: _, ...data } = state
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finance-timeline-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      const text = await file.text()
      const data = JSON.parse(text) as Omit<AppState, 'loading'>

      if (!data.transactions || !data.settings) {
        alert('Invalid file format.')
        return
      }

      if (!confirm('This will replace all your existing data. Continue?')) return

      // Clear existing data
      await Promise.all([
        supabase.from('debt_payments').delete().eq('user_id', user.id),
        supabase.from('occurrence_overrides').delete().eq('user_id', user.id),
      ])
      await supabase.from('transactions').delete().eq('user_id', user.id)
      await supabase.from('debts').delete().eq('user_id', user.id)

      // Insert new data with current user_id
      const userId = user.id
      if (data.transactions.length > 0) {
        await supabase.from('transactions').insert(
          data.transactions.map((t) => ({ ...t, user_id: userId }))
        )
      }
      if (data.occurrenceOverrides.length > 0) {
        await supabase.from('occurrence_overrides').insert(
          data.occurrenceOverrides.map((o) => ({ ...o, user_id: userId }))
        )
      }
      if (data.debts.length > 0) {
        await supabase.from('debts').insert(
          data.debts.map((d) => ({ ...d, user_id: userId }))
        )
      }
      if (data.debtPayments.length > 0) {
        await supabase.from('debt_payments').insert(
          data.debtPayments.map((p) => ({ ...p, user_id: userId }))
        )
      }
      await supabase.from('user_settings').upsert({
        ...data.settings,
        user_id: userId,
      })

      dispatch({ type: 'IMPORT_STATE', payload: { ...data, settings: { ...data.settings, user_id: userId } } })
    } catch {
      alert('Failed to import file. Make sure it is a valid JSON export.')
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <button
        onClick={onMenuToggle}
        className="lg:hidden text-gray-600 hover:text-gray-900"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={handleExport}
          className="px-2.5 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded font-medium"
          title="Export data as JSON"
        >
          Export
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-2.5 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded font-medium"
          title="Import data from JSON"
        >
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        <span className="w-px h-5 bg-gray-200 mx-1" />
        <span className="text-gray-500 hidden sm:inline">{user?.email}</span>
        <button
          onClick={signOut}
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
