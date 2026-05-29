import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';
import AllIncidentsPage from './pages/AllIncidentsPage';
import IncidentDetailPage from './pages/IncidentDetailPage';
import AgencyDashboardPage from './pages/AgencyDashboardPage';
import UserManagementPage from './pages/UserManagementPage';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/incidents"
          element={
            <ProtectedRoute>
              <AllIncidentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/incidents/:incidentId"
          element={
            <ProtectedRoute>
              <IncidentDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/agency/:agencySlug"
          element={
            <ProtectedRoute>
              <AgencyDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/users"
          element={
            <ProtectedRoute>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
export default App;
