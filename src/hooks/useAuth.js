import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Ensure path and case sensitivity match

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
