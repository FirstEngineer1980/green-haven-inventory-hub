
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useToast } from '@/hooks/use-toast';

// Define types
type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
  register: async () => {},
  hasPermission: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      console.log("Checking authentication status...");
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log("No token found");
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      try {
        console.log("Token found, fetching current user");
        const response = await authAPI.getCurrentUser();
        console.log("User data received:", response.data);
        setUser(response.data);
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Attempting login for:", email);
      const response = await authAPI.login({ email, password });
      console.log("Login response:", response.data);
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.data.user?.name || ''}!`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      console.log("Logging out user");
      await authAPI.logout();
      localStorage.removeItem('token');
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string, passwordConfirmation: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register({ name, email, password, password_confirmation: passwordConfirmation });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      toast({
        title: "Registration successful",
        description: `Welcome, ${response.data.user.name}!`,
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Registration failed",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Permission check function
  const hasPermission = (permission: string) => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easier consumption of auth context
export const useAuth = () => useContext(AuthContext);
