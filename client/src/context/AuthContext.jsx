import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('codeanova_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on initial mount or token change
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('codeanova_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.status === 'success' && res.user) {
            setUser(res.user);
            setToken(storedToken);
          } else {
            handleLogout();
          }
        } catch (err) {
          handleLogout();
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLogin = (authToken, userData) => {
    localStorage.setItem('codeanova_token', authToken);
    setToken(authToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('codeanova_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        loading,
        login: handleLogin,
        logout: handleLogout,
        setUser,
      }}
    >
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

