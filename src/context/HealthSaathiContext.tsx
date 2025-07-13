// context/HealthSaathiContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// ✅ User type
type User = {
  _id: string;
  phoneNumber: string;
  role: 'user' | 'admin';
  name?: string;
};

// ✅ Context type
type HealthSaathiContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  language: string;
  setLanguage: (lang: string) => void;
};

// ✅ Create context
const HealthSaathiContext = createContext<HealthSaathiContextType | undefined>(undefined);

// ✅ Provider
export const HealthSaathiProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Load from localStorage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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
      value={{ isAuthenticated, user, login, logout, language, setLanguage }}
    >
      {children}
    </HealthSaathiContext.Provider>
  );
};

// ✅ Hook
export const useHealthSaathi = () => {
  const context = useContext(HealthSaathiContext);
  if (!context) {
    throw new Error('useHealthSaathi must be used within a HealthSaathiProvider');
  }
  return context;
};
