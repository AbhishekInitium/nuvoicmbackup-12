
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Define the user roles
export type UserRole = 'admin' | 'manager' | 'agent' | 'finance';

// Define the user type
export interface User {
  username: string;
  role: UserRole;
  clientId: string;
  isAuthenticated: boolean;
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  login: (username: string, role: UserRole, clientId: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem('nuvo_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, role: UserRole, clientId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // In a real app, you would validate credentials against your MongoDB here
      // For now, we'll simulate a successful login and store the user info
      
      const newUser: User = {
        username,
        role,
        clientId,
        isAuthenticated: true
      };
      
      // Store user in local storage for persistence
      localStorage.setItem('nuvo_user', JSON.stringify(newUser));
      setUser(newUser);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('nuvo_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
