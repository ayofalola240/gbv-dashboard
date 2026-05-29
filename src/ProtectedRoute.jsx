import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ROLE_TO_AGENCY_SLUG } from './config/agencies';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    const ownSlug = ROLE_TO_AGENCY_SLUG[user?.role];
    const fallback = ownSlug ? `/dashboard/agency/${ownSlug}` : '/login';
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
