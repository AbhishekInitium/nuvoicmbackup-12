
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, logoutUser } from '@/services/auth/userService';

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
      
      // Call the authentication service
      const result = await loginUser({
        username,
        role,
        clientId
      });
      
      if (result.isAuthenticated) {
        // Store user in local storage for persistence
        localStorage.setItem('nuvo_user', JSON.stringify(result));
        setUser(result);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (user) {
      try {
        // Call the logout service if user exists
        await logoutUser(user.username);
      } catch (error) {
        console.error('Logout API call failed:', error);
      }
    }
    
    // Clear local storage and state regardless of API success
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
