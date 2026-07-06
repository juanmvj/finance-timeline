import { useMemo } from 'react'
import { addDays } from 'date-fns'
import { useAppContext } from '../store/AppContext'
import { useBalanceForecast } from '../hooks/useBalanceForecast'
import { useOccurrences } from '../hooks/useOccurrences'
import { SummaryCards } from '../components/dashboard/SummaryCards'
import { UpcomingItems } from '../components/dashboard/UpcomingItems'
import { ForecastChart } from '../components/forecast/ForecastChart'
import { WarningList } from '../components/forecast/WarningList'

export function DashboardPage() {
  const { state } = useAppContext()
  const { points, warnings } = useBalanceForecast()

  const now = useMemo(() => new Date(), [])
  const in7Days = useMemo(() => addDays(now, 7), [now])
  const in30Days = useMemo(() => addDays(now, 30), [now])

  const upcoming7 = useOccurrences(now, in7Days)
  const upcoming30 = useOccurrences(now, in30Days)

  const upcomingIncome = useMemo(
    () => upcoming30.filter((o) => o.type === 'income').reduce((sum, o) => sum + o.amount, 0),
    [upcoming30]
  )
  const upcomingExpenses = useMemo(
    () => upcoming30.filter((o) => o.type === 'expense').reduce((sum, o) => sum + o.amount, 0),
    [upcoming30]
  )
  const totalDebt = useMemo(
    () => state.debts.reduce((sum, d) => sum + d.current_balance, 0),
    [state.debts]
  )

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>

      <SummaryCards
        currentBalance={state.settings.current_balance}
        upcomingIncome={upcomingIncome}
        upcomingExpenses={upcomingExpenses}
        totalDebt={totalDebt}
      />

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Balance Forecast</h3>
        <ForecastChart
          points={points}
          minimumSafeBalance={state.settings.minimum_safe_balance}
          compact
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UpcomingItems occurrences={upcoming7} />
        <WarningList warnings={warnings} />
      </div>
    </div>
  )
}
