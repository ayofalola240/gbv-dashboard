import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Button from './Button';
import nigeriaLogo from '../../assets/nigeria-logo.png';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-primary-white p-4 shadow-md border-b-3 border-primary-green">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        {/* Logo and Title Section */}
        <Link to="/dashboard" className="flex items-center">
          <img src={nigeriaLogo} alt="Nigerian Coat of Arms" className="h-8 sm:h-10 mr-2 sm:mr-3" />
          <h1 className="text-lg sm:text-xl font-semibold text-primary-green whitespace-nowrap">FCTA GBV Dashboard</h1>
        </Link>

        {/* Navigation Links - Placed here to be central or shift based on auth state */}
        <nav className="flex items-center space-x-4 sm:space-x-6 mt-2 sm:mt-0 mx-auto sm:mx-0 order-last sm:order-none">
          {/* This ensures nav is last in flex order on mobile, but auto-placed on larger screens */}
          {isAuthenticated && ( // Only show "All Incidents" if authenticated
            <Link
              to="/dashboard/incidents"
              className="text-sm sm:text-base text-primary-green hover:text-dark-green font-medium px-3 py-2 rounded-md hover:bg-light-green transition-colors"
            >
              All Incidents
            </Link>
          )}
          {/* You can add more top-level navigation links here if needed */}
        </nav>

        {/* Authentication Section */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-3 mt-2 sm:mt-0 ml-auto">
            {' '}
            {/* ml-auto pushes it to the right on larger screens */}
            <span className="text-text-dark text-sm sm:text-base hidden md:inline">
              {' '}
              {/* Hide welcome on small screens if too crowded */}
              Welcome, {user?.firstname || 'Admin'}!
            </span>
            <Button
              onClick={handleLogout}
              primary
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm" // Slightly smaller button for header
            >
              Logout
            </Button>
          </div>
        ) : (
          <div className="w-0 h-0"></div> // Placeholder to maintain justify-between if no auth section
        )}
      </div>
    </header>
  );
};

export default Header;
