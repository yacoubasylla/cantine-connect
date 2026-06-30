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
        <Route path="dashboard"      element={<DashboardPage />} />
        <Route path="etablissements" element={<EtablissementsPage />} />
        <Route path="eleves"         element={<ElevesPage />} />
        <Route path="paiements"      element={<PaiementsPage />} />
        <Route path="scan"           element={<ScanPage />} />
        <Route path="utilisateurs"   element={<AdminRoute><UtilisateursPage /></AdminRoute>} />
      </Route>
    </Routes>
  )
}
