import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import type { PayoffProjectionPoint } from '../../lib/debt'

interface DebtPayoffChartProps {
  points: PayoffProjectionPoint[]
}

export function DebtPayoffChart({ points }: DebtPayoffChartProps) {
  if (points.length <= 1) return null

  // Sample points if too many (keep it under 50 for readability)
  const sampled = points.length > 50
    ? points.filter((_, i) => i === 0 || i === points.length - 1 || i % Math.ceil(points.length / 50) === 0)
    : points

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={sampled} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tickFormatter={(d: string) => format(parseISO(d), 'MMM yy')}
          tick={{ fontSize: 10 }}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v: number) => `$${v.toLocaleString()}`}
          tick={{ fontSize: 10 }}
          width={65}
        />
        <Tooltip
          labelFormatter={(d) => format(parseISO(String(d)), 'MMM yyyy')}
          formatter={(value, name) => [
            `$${Number(value).toFixed(2)}`,
            name === 'remainingBalance' ? 'Remaining' : String(name),
          ]}
        />
        <Area
          type="monotone"
          dataKey="remainingBalance"
          stroke="#3b82f6"
          fill="#dbeafe"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
