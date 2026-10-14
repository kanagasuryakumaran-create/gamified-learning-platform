import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('learnquest_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('learnquest_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.login({ email, password });
      setUser(data.user);
      setToken(data.access_token);
      localStorage.setItem('learnquest_token', data.access_token);
      localStorage.setItem('learnquest_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (fullName, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.register({
        full_name: fullName,
        email,
        password,
        role
      });
      setUser(data.user);
      setToken(data.access_token);
      localStorage.setItem('learnquest_token', data.access_token);
      localStorage.setItem('learnquest_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('learnquest_token');
    localStorage.removeItem('learnquest_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      login: loginUser,
      register: registerUser,
      logout: logoutUser,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
