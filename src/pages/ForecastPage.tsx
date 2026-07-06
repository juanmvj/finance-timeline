import { useBalanceForecast } from '../hooks/useBalanceForecast'
import { useSettings } from '../hooks/useSettings'
import { ForecastChart } from '../components/forecast/ForecastChart'
import { ForecastControls } from '../components/forecast/ForecastControls'
import { WarningList } from '../components/forecast/WarningList'

export function ForecastPage() {
  const { points, warnings } = useBalanceForecast()
  const { settings } = useSettings()

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Balance Forecast</h2>

      <ForecastControls />

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <ForecastChart points={points} minimumSafeBalance={settings.minimum_safe_balance} />
      </div>

      <WarningList warnings={warnings} />
    </div>
  )
}
