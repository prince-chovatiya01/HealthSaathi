// context/HealthSaathiContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  _id: string;
  phoneNumber: string;
  role: 'user' | 'admin';
  name?: string;
};

type HealthSaathiContextType = {
  isAuthenticated: boolean;
  user: User | null;
  authLoading: boolean; // NEW: true while restoring from localStorage
  login: (userData: User) => void;
  logout: () => void;
  language: string;
  setLanguage: (lang: string) => void;
};

const HealthSaathiContext = createContext<HealthSaathiContextType | undefined>(undefined);

export const HealthSaathiProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState('en');
  const [authLoading, setAuthLoading] = useState(true); // wait until localStorage is read

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch { /* ignore corrupt data */ }
    }
    setAuthLoading(false); // done restoring
  }, []);

  const login = (userData: User & { token?: string }) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!user;

  return (
    <HealthSaathiContext.Provider
      value={{ isAuthenticated, user, authLoading, login, logout, language, setLanguage }}
    >
      {children}
    </HealthSaathiContext.Provider>
  );
};

export const useHealthSaathi = () => {
  const context = useContext(HealthSaathiContext);
  if (!context) {
    throw new Error('useHealthSaathi must be used within a HealthSaathiProvider');
  }
  return context;
};
