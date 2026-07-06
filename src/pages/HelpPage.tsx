export function HelpPage() {
  const sectionClass = 'bg-white rounded-lg border border-gray-200 p-5'
  const headingClass = 'text-base font-semibold text-gray-900 mb-2'
  const textClass = 'text-sm text-gray-600 leading-relaxed'
  const subheadClass = 'text-sm font-semibold text-gray-800 mt-3 mb-1'

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Help</h2>

      <div className={sectionClass}>
        <h3 className={headingClass}>Getting Started</h3>
        <p className={textClass}>
          Start by going to the <strong>Forecast</strong> page and entering your current bank balance
          and the date it's accurate as of. Then head to <strong>Transactions</strong> and add your
          recurring income (salary, freelance payments, etc.) and recurring expenses (rent, subscriptions,
          utilities). Once those are in, the dashboard and forecast chart will automatically project your
          balance forward.
        </p>
      </div>

      <div className={sectionClass}>
        <h3 className={headingClass}>Transactions</h3>
        <p className={textClass}>
          Click <strong>+ Add</strong> to create a transaction. Every transaction has a name, amount,
          type (income or expense), date, and recurrence.
        </p>
        <h4 className={subheadClass}>Recurrence options</h4>
        <ul className={`${textClass} list-disc list-inside space-y-1`}>
          <li><strong>One time</strong> — happens once on the specified date.</li>
          <li><strong>Weekly</strong> — repeats every 7 days from the start date.</li>
          <li><strong>Biweekly</strong> — repeats every 14 days (e.g. biweekly paycheck).</li>
          <li><strong>Monthly</strong> — repeats on the same day each month.</li>
          <li><strong>Yearly</strong> — repeats once a year on the same date.</li>
        </ul>
        <p className={`${textClass} mt-2`}>
          For recurring transactions, you can optionally set an <strong>end date</strong> to stop
          generating future occurrences after a certain point.
        </p>
        <h4 className={subheadClass}>List vs. Calendar view</h4>
        <p className={textClass}>
          Use the <strong>List / Calendar</strong> toggle at the top. List view shows all your
          transaction templates in a sortable table. Calendar view shows a month grid with every
          generated occurrence — useful for seeing what lands on which day.
        </p>
      </div>

      <div className={sectionClass}>
        <h3 className={headingClass}>Editing & Deleting Recurring Transactions</h3>
        <p className={textClass}>
          When you edit or delete a recurring transaction from the list view, the change applies to
          the <strong>entire series</strong> (every past and future occurrence).
        </p>
        <p className={`${textClass} mt-2`}>
          From the calendar view, you can click a specific occurrence. In the future, this will support
          editing just that single occurrence while leaving the rest of the series unchanged. For now,
          edits from the calendar also apply to the full series.
        </p>
      </div>

      <div className={sectionClass}>
        <h3 className={headingClass}>Balance Forecast</h3>
        <p className={textClass}>
          The forecast page projects your bank balance forward based on your current balance and all
          upcoming transactions.
        </p>
        <h4 className={subheadClass}>Settings</h4>
        <ul className={`${textClass} list-disc list-inside space-y-1`}>
          <li><strong>Current Balance</strong> — the actual amount in your account right now.</li>
          <li><strong>As of Date</strong> — the date that balance is accurate. Transactions from this date forward are applied.</li>
          <li><strong>Forecast Window</strong> — how far ahead to project: 30, 60, or 90 days.</li>
          <li><strong>Min Safe Balance</strong> — a threshold you set. If the projected balance drops below this, you'll see a warning.</li>
        </ul>
        <h4 className={subheadClass}>Reading the chart</h4>
        <p className={textClass}>
          The blue line shows your projected balance over time. It steps down when an expense hits and
          steps up when income arrives. A <strong>red dashed line</strong> marks $0 — if your balance
          crosses it, you'd be overdrawn. An <strong>orange dashed line</strong> marks your minimum
          safe balance.
        </p>
      </div>

      <div className={sectionClass}>
        <h3 className={headingClass}>Debt Tracking</h3>
        <p className={textClass}>
          Add debts you're paying off — credit cards, loans, etc. Each debt tracks:
        </p>
        <ul className={`${textClass} list-disc list-inside space-y-1 mt-1`}>
          <li><strong>Original amount</strong> — what you initially owed.</li>
          <li><strong>Current balance</strong> — what you still owe today.</li>
          <li><strong>Interest rate</strong> (optional) — annual percentage rate. If provided, the payoff projection accounts for monthly interest accrual.</li>
          <li><strong>Minimum payment</strong> — how much you pay each month.</li>
          <li><strong>Due date</strong> — when the next payment is due.</li>
        </ul>
        <h4 className={subheadClass}>Recording payments</h4>
        <p className={textClass}>
          Click <strong>Record Payment</strong> on any debt to log a payment. This reduces the
          remaining balance.
        </p>
        <h4 className={subheadClass}>Payoff projection</h4>
        <p className={textClass}>
          Each debt shows an estimated payoff date and a chart of the remaining balance decreasing over
          time. If the interest rate is set and your minimum payment doesn't cover the monthly interest,
          you'll see a warning that the debt will never be paid off at the current rate.
        </p>
      </div>

      <div className={sectionClass}>
        <h3 className={headingClass}>Dashboard</h3>
        <p className={textClass}>
          The dashboard gives you a quick overview:
        </p>
        <ul className={`${textClass} list-disc list-inside space-y-1 mt-1`}>
          <li><strong>Summary cards</strong> — current balance, total income and expenses in the next 30 days, and total remaining debt.</li>
          <li><strong>Forecast chart</strong> — a compact version of the balance forecast.</li>
          <li><strong>Upcoming items</strong> — transactions hitting in the next 7 days.</li>
          <li><strong>Warnings</strong> — alerts for dates where your balance is projected to go negative or drop below the safe minimum.</li>
        </ul>
      </div>

      <div className={sectionClass}>
        <h3 className={headingClass}>Import & Export</h3>
        <p className={textClass}>
          Use the <strong>Export</strong> button in the top header to download all your data as a JSON
          file. This is your backup — save it somewhere safe.
        </p>
        <p className={`${textClass} mt-2`}>
          Use the <strong>Import</strong> button to restore from a previously exported file. Note that
          importing <strong>replaces all existing data</strong> — you'll be asked to confirm before it
          proceeds.
        </p>
      </div>
    </div>
  )
}
