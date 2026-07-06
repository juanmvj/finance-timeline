import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './store/AppContext'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { ForecastPage } from './pages/ForecastPage'
import { DebtsPage } from './pages/DebtsPage'
import { HelpPage } from './pages/HelpPage'
import { supabaseConfigured } from './lib/supabase'

function App() {
  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-lg shadow p-6 max-w-md text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Configuration Error</h1>
          <p className="text-sm text-gray-600">
            Missing Supabase environment variables. Set{' '}
            <code className="bg-gray-100 px-1 rounded text-xs">VITE_SUPABASE_URL</code> and{' '}
            <code className="bg-gray-100 px-1 rounded text-xs">VITE_SUPABASE_ANON_KEY</code> in
            your environment or <code className="bg-gray-100 px-1 rounded text-xs">.env.local</code> file.
          </p>
        </div>
      </div>
    )
  }

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
