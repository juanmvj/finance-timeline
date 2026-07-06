import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './store/AppContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { ForecastPage } from './pages/ForecastPage'
import { DebtsPage } from './pages/DebtsPage'
import { HelpPage } from './pages/HelpPage'

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ProtectedRoute>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/forecast" element={<ForecastPage />} />
              <Route path="/debts" element={<DebtsPage />} />
              <Route path="/help" element={<HelpPage />} />
            </Route>
          </Routes>
        </ProtectedRoute>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App
