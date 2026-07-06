import { useState, useEffect } from 'react'
import { useSettings } from '../../hooks/useSettings'
import type { UserSettings } from '../../types'

/** Show empty string when value is 0 so the input doesn't show a leading zero */
function numToStr(n: number): string {
  return n === 0 ? '' : String(n)
}

export function ForecastControls() {
  const { settings, updateSettings } = useSettings()
  const [balanceStr, setBalanceStr] = useState(numToStr(settings.current_balance))
  const [minSafeStr, setMinSafeStr] = useState(numToStr(settings.minimum_safe_balance))

  useEffect(() => { setBalanceStr(numToStr(settings.current_balance)) }, [settings.current_balance])
  useEffect(() => { setMinSafeStr(numToStr(settings.minimum_safe_balance)) }, [settings.minimum_safe_balance])

  const inputClass = 'w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
  const labelClass = 'block text-xs font-medium text-gray-500 mb-1'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Settings</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className={labelClass}>Current Balance</label>
          <input
            type="number"
            step="0.01"
            value={balanceStr}
            onChange={(e) => {
              setBalanceStr(e.target.value)
              updateSettings({ current_balance: parseFloat(e.target.value) || 0 })
            }}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>As of Date</label>
          <input
            type="date"
            value={settings.balance_as_of_date}
            onChange={(e) => updateSettings({ balance_as_of_date: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Forecast Window</label>
          <select
            value={settings.forecast_days}
            onChange={(e) => updateSettings({ forecast_days: parseInt(e.target.value) as UserSettings['forecast_days'] })}
            className={inputClass}
          >
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Min Safe Balance</label>
          <input
            type="number"
            step="0.01"
            value={minSafeStr}
            onChange={(e) => {
              setMinSafeStr(e.target.value)
              updateSettings({ minimum_safe_balance: parseFloat(e.target.value) || 0 })
            }}
            placeholder="0.00"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  )
}
