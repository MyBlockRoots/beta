import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as loginApi, register as registerApi } from '../services/api';

// Create auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkLoggedIn = () => {
      const token = localStorage.getItem('token');
      if (token) {
        // In a real app, you would verify the token with the backend
        // For now, we'll just parse the token and set the user
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setCurrentUser({
            id: payload.id,
            username: payload.username
          });
        } catch (err) {
          console.error('Invalid token:', err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Register a new user
  const register = async (username, email, password) => {
    setError('');
    try {
      const response = await registerApi({ username, email, password });
      localStorage.setItem('token', response.data.token);
      
      // Set current user from token payload
      const payload = JSON.parse(atob(response.data.token.split('.')[1]));
      setCurrentUser({
        id: payload.id,
        username: payload.username
      });
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  // Login user
  const login = async (email, password) => {
    setError('');
    try {
      const response = await loginApi({ email, password });
      localStorage.setItem('token', response.data.token);
      
      // Set current user from token payload
      const payload = JSON.parse(atob(response.data.token.split('.')[1]));
      setCurrentUser({
        id: payload.id,
        username: payload.username
      });
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext; 