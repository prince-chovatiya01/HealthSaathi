// import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
// import { User, Language } from '../types';

// interface HealthSaathiContextType {
//   user: User | null;
//   language: Language;
//   isAuthenticated: boolean;
//   setUser: (user: User | null) => void;
//   setLanguage: (lang: Language) => void;
//   login: (phoneNumber: string) => Promise<void>;
//   logout: () => void;
// }

// const defaultContext: HealthSaathiContextType = {
//   user: null,
//   language: 'en',
//   isAuthenticated: false,
//   setUser: () => {},
//   setLanguage: () => {},
//   login: async () => {},
//   logout: () => {},
// };

// const HealthSaathiContext = createContext<HealthSaathiContextType>(defaultContext);

// export const useHealthSaathi = () => useContext(HealthSaathiContext);

// interface ProviderProps {
//   children: ReactNode;
// }

// export const HealthSaathiProvider: React.FC<ProviderProps> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [language, setLanguage] = useState<Language>('en');

//   const login = async (phoneNumber: string) => {
//     // Simulate async API call with a delay
//     await new Promise((resolve) => setTimeout(resolve, 800));

//     setUser({
//       id: 'user123',
//       name: 'Rajesh Kumar',
//       phoneNumber,
//       village: 'Mayapur',
//       district: 'Hooghly',
//       state: 'West Bengal',
//     });
//   };

//   const logout = () => {
//     setUser(null);
//   };

//   const value = useMemo(() => ({
//     user,
//     language,
//     isAuthenticated: !!user,
//     setUser,
//     setLanguage,
//     login,
//     logout,
//   }), [user, language]);

//   return (
//     <HealthSaathiContext.Provider value={value}>
//       {children}
//     </HealthSaathiContext.Provider>
//   );
// };



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
