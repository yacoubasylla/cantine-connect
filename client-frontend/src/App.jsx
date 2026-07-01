import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/DashboardPage'
import EtablissementsPage from './pages/etablissements/EtablissementsPage'
import ElevesPage from './pages/eleves/ElevesPage'
import PaiementsPage      from './pages/paiements/PaiementsPage'
import ScanPage           from './pages/scan/ScanPage'
import UtilisateursPage   from './pages/utilisateurs/UtilisateursPage'
import ProtectedRoute     from './components/ProtectedRoute'
import AdminRoute         from './components/AdminRoute'
import ErrorBoundary      from './components/ErrorBoundary'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"      element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />
        <Route path="etablissements" element={<ErrorBoundary><EtablissementsPage /></ErrorBoundary>} />
        <Route path="eleves"         element={<ErrorBoundary><ElevesPage /></ErrorBoundary>} />
        <Route path="paiements"      element={<ErrorBoundary><PaiementsPage /></ErrorBoundary>} />
        <Route path="scan"           element={<ErrorBoundary><ScanPage /></ErrorBoundary>} />
        <Route path="utilisateurs"   element={<ErrorBoundary><AdminRoute><UtilisateursPage /></AdminRoute></ErrorBoundary>} />
      </Route>
    </Routes>
  )
}
