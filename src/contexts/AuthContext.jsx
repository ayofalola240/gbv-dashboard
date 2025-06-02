import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister } from '../services/authService'; // Make sure this path is correct

// 1. Define and EXPORT AuthContext
export const AuthContext = createContext(null);

// 2. AuthProvider component (already correctly exported)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || null); // Initialize from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('authToken')); // Initialize from localStorage
  const [loading, setLoading] = useState(true); // To manage initial loading state

  useEffect(() => {
    // This effect ensures that on initial load, we check localStorage.
    // The initial state for token and isAuthenticated already does this,
    // but this effect handles the user object and confirms loading is done.
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('userData');

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse stored user data', e);
        // Clear potentially corrupted data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false); // Done checking initial auth state
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await apiLogin(email, password); // data includes user object and token
      localStorage.setItem('authToken', data.token);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          // Store only necessary, non-sensitive user info
          _id: data._id,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          phone: data.phone
        })
      );
      setToken(data.token);
      setUser({
        _id: data._id,
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone
      });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed in AuthContext:', error);
      // Ensure states are reset on failure
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      throw error; // Re-throw to be caught by the form
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // Assuming apiRegister returns some confirmation or user data (even if not used immediately)
      await apiRegister(userData);
      // After successful registration, user should typically log in separately
      // Or your backend could return a token here to auto-login
      return true;
    } catch (error) {
      console.error('Registration failed in AuthContext:', error);
      throw error; // Re-throw to be caught by the form
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    // Optionally navigate to login page here if using react-router programmatically
  };

  // Show a loading indicator during the initial check, only if not already authenticated
  // This prevents a flash of the login page for authenticated users on page reload.
  if (loading) {
    return <div>Loading Application...</div>; // Or your global spinner
  }

  return <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, logout }}>{children}</AuthContext.Provider>;
};

// 3. Custom hook to use the auth context (already correctly exported)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // This error means useAuth is called outside of AuthProvider
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
