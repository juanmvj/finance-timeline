import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import type { BalancePoint } from '../../lib/balance'

interface ForecastChartProps {
  points: BalancePoint[]
  minimumSafeBalance: number
  compact?: boolean
}

export function ForecastChart({ points, minimumSafeBalance, compact = false }: ForecastChartProps) {
  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        No forecast data. Set your current balance to get started.
      </div>
    )
  }

  const minBalance = Math.min(...points.map((p) => p.balance))
  const yMin = Math.min(0, minBalance - 100)

  return (
    <ResponsiveContainer width="100%" height={compact ? 200 : 350}>
      <LineChart data={points} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tickFormatter={(d: string) => format(parseISO(d), compact ? 'M/d' : 'MMM d')}
          tick={{ fontSize: 11 }}
          interval={compact ? Math.floor(points.length / 5) : 'preserveStartEnd'}
        />
        <YAxis
          domain={[yMin, 'auto']}
          tickFormatter={(v: number) => `$${v.toLocaleString()}`}
          tick={{ fontSize: 11 }}
          width={70}
        />
        <Tooltip
          labelFormatter={(d) => format(parseISO(String(d)), 'EEE, MMM d, yyyy')}
          formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Balance']}
        />
        <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" label={compact ? undefined : { value: '$0', position: 'right', fill: '#ef4444', fontSize: 11 }} />
        {minimumSafeBalance > 0 && (
          <ReferenceLine
            y={minimumSafeBalance}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            label={compact ? undefined : { value: `Min: $${minimumSafeBalance}`, position: 'right', fill: '#f59e0b', fontSize: 11 }}
          />
        )}
        <Line
          type="stepAfter"
          dataKey="balance"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#3b82f6' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
