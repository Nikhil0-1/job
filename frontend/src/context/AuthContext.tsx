'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  id: string;
  email: string;
  role: string;
  employerProfileId?: string;
  companyId?: string;
  companyName?: string;
  isProfileComplete?: boolean;
  hasCompany?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  isAuthenticated: boolean;
  isEmployer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const storedToken = localStorage.getItem('jp_token');
        const storedUser = localStorage.getItem('jp_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Validate token with backend
          const res = await authAPI.getMe();
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('jp_user', JSON.stringify(res.data.data));
          }
        }
      } catch {
        localStorage.removeItem('jp_token');
        localStorage.removeItem('jp_user');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('jp_token', newToken);
    localStorage.setItem('jp_user', JSON.stringify(newUser));
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {}
    setToken(null);
    setUser(null);
    localStorage.removeItem('jp_token');
    localStorage.removeItem('jp_user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      localStorage.setItem('jp_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!token && !!user,
        isEmployer: user?.role === 'EMPLOYER' || user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
