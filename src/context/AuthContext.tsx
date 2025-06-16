import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { auth } from '../api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phoneNumber: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth.getProfile()
        .then(response => setUser(response.data.user || response.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login method
  const login = useCallback(async (phoneNumber: string, password: string) => {
    setLoading(true);
    try {
      const response = await auth.login({ phoneNumber, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user || response.data);
    } catch (error) {
      throw error; // rethrow so UI can handle it
    } finally {
      setLoading(false);
    }
  }, []);

  // Register method
  const register = useCallback(async (userData: any) => {
    setLoading(true);
    try {
      const response = await auth.register(userData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user || response.data);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
  }), [user, loading, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
