import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/authService';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'staff';
  lastLogin?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  hasRole: (role: 'admin' | 'staff') => boolean;
  isAdmin: () => boolean;
  isStaff: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // Initialize with current auth state from service
    return {
      isAuthenticated: authService.isAuthenticated(),
      user: authService.getCurrentUser(),
      token: authService.getToken()
    };
  });

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  const login = async (username: string, password: string) => {
    return await authService.login(username, password);
  };

  const logout = () => {
    authService.logout();
  };

  const hasRole = (role: 'admin' | 'staff') => {
    return authState.user?.role === role;
  };

  const isAdmin = () => {
    return hasRole('admin');
  };

  const isStaff = () => {
    return hasRole('staff');
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    hasRole,
    isAdmin,
    isStaff
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

