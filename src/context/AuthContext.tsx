
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, Permission } from '../types';
import { mockUsers } from '../data/mockData';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const userData = localStorage.getItem('ghCurrentUser');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('ghCurrentUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, we would make an API call here
    // For now, just simulate authentication with mock data
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple validation
      if (!email || !password) {
        toast({
          title: "Error",
          description: "Please enter both email and password.",
          variant: "destructive"
        });
        return false;
      }
      
      // Find user by email (in a real app, this would be handled by the backend)
      const user = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        toast({
          title: "Error",
          description: "Invalid email or password.",
          variant: "destructive"
        });
        return false;
      }
      
      // In a real app, we would check the password hash here
      // Simulate successful login
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('ghCurrentUser', JSON.stringify(user));
      
      toast({
        title: "Success",
        description: `Welcome back, ${user.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('ghCurrentUser');
    navigate('/login');
    toast({
      title: "Success",
      description: "You have been successfully logged out.",
    });
  };

  const hasPermission = (permission: Permission): boolean => {
    return !!currentUser?.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
