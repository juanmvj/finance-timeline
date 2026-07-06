interface SummaryCardsProps {
  currentBalance: number
  upcomingIncome: number
  upcomingExpenses: number
  totalDebt: number
}

export function SummaryCards({ currentBalance, upcomingIncome, upcomingExpenses, totalDebt }: SummaryCardsProps) {
  const cards = [
    { label: 'Current Balance', value: currentBalance, color: 'text-gray-900' },
    { label: 'Income (30 days)', value: upcomingIncome, color: 'text-green-600' },
    { label: 'Expenses (30 days)', value: upcomingExpenses, color: 'text-red-600' },
    { label: 'Total Debt', value: totalDebt, color: 'text-orange-600' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div key={card.label} className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs font-medium text-gray-500 mb-1">{card.label}</p>
          <p className={`text-xl font-bold font-mono ${card.color}`}>
            ${card.value.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  )
}
