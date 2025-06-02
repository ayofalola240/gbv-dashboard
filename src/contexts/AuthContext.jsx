import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister } from '../services/authService'; // Make sure this path is correct

// 1. Define and EXPORT AuthContext
export const AuthContext = createContext(null);

// 2. AuthProvider component (already correctly exported)
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('authToken'));

  useEffect(() => {
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
  }, []);

  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);

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
    }
  };

  const register = async (userData) => {
    try {
      await apiRegister(userData);
      return true;
    } catch (error) {
      console.error('Registration failed in AuthContext:', error);
      throw error; // Re-throw to be caught by the form
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

  return <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout }}>{children}</AuthContext.Provider>;
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
