import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { adminApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('aadhiran_admin_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aadhiran_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await adminApi.getMe();
        setUser(currentUser);
        localStorage.setItem('aadhiran_admin_user', JSON.stringify(currentUser));
      } catch (err) {
        console.warn('Session verification failed, clearing auth');
        localStorage.removeItem('aadhiran_admin_token');
        localStorage.removeItem('aadhiran_admin_user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('aadhiran_admin_token', newToken);
    localStorage.setItem('aadhiran_admin_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('aadhiran_admin_token');
    localStorage.removeItem('aadhiran_admin_user');
    setToken(null);
    setUser(null);
    window.location.href = '/admin/login';
  };

  const refreshUser = async () => {
    try {
      const u = await adminApi.getMe();
      setUser(u);
      localStorage.setItem('aadhiran_admin_user', JSON.stringify(u));
    } catch (e) {
      console.error('Failed to refresh user', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
