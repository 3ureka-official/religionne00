'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, isEmailAllowed } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      if (user && isEmailAllowed(user.email)) {
        setUser(user);
        sessionStorage.setItem('adminAuth', 'true');
      } else {
        setUser(null);
        sessionStorage.removeItem('adminAuth');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAuthenticated = !!user && isEmailAllowed(user.email);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

