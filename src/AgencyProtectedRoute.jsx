import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { getAllowedAgencySlugs, ROLE_TO_AGENCY_SLUG } from './config/agencies';

const AgencyProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { agencySlug } = useParams();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const allowedSlugs = getAllowedAgencySlugs(user?.role);

  if (!allowedSlugs.includes(agencySlug)) {
    const ownSlug = ROLE_TO_AGENCY_SLUG[user?.role];
    const fallback = ownSlug ? `/dashboard/agency/${ownSlug}` : '/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default AgencyProtectedRoute;
