import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Button from './Button'; // Assuming Button.jsx is in the same directory
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
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        {/* Logo and Title Section */}
        <Link to="/dashboard" className="flex items-center mb-4 sm:mb-0">
          {' '}
          {/* Added margin-bottom for mobile stacking */}
          <img
            src={nigeriaLogo}
            alt="Nigerian Coat of Arms" // More descriptive alt text
            className="h-8 sm:h-10 mr-2 sm:mr-3" // Slightly smaller logo on mobile, adjusted margin
          />
          <h1 className="text-lg sm:text-xl font-semibold text-primary-green">
            FCTA GBV Dashboard {/* Shortened for brevity, can be full on larger screens if designed */}
          </h1>
        </Link>

        {/* Authentication Section */}
        {isAuthenticated && (
          <div className="flex flex-col items-center sm:flex-row sm:items-center">
            {' '}
            {/* Stacks on mobile, row on sm+ */}
            <span className="text-text-dark text-sm sm:text-base mr-0 sm:mr-4 mb-2 sm:mb-0">
              {' '}
              {/* Adjusted text size and margins */}
              Welcome, {user?.firstname || 'Admin'}!
            </span>
            <Button
              onClick={handleLogout}
              primary
              className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base" // Full width on mobile stack, padding/text size adjust
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
