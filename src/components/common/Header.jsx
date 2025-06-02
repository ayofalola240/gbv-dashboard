import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom'; // Fixed import: Link is imported directly
import Button from './Button';
import nigeriaLogo from '../../assets/nigeria-logo.png';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth(); // Destructure auth for clarity
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Use destructured logout function
    navigate('/login');
  };

  return (
    <header className="bg-primary-white p-4 shadow-md border-b-3 border-primary-green">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center">
          <img src={nigeriaLogo} alt="Nigeria Logo" className="h-10 mr-3" /> {/* Improved alt text */}
          <h1 className="text-xl font-semibold text-primary-green">FCTA GBV Incident Dashboard</h1>
        </Link>
        {isAuthenticated && ( // Use destructured isAuthenticated
          <div className="flex items-center">
            <span className="text-text-dark mr-4">Welcome, {user?.firstname || 'Admin'}!</span>
            <Button onClick={handleLogout} primary>
              {' '}
              {/* Made logout button primary */}
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
