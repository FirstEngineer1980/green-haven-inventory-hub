
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login as loginService, logout as logoutService, getCurrentUser } from '@/api/services/authService';
import { User } from '@/api/types/authTypes';
import { toast } from 'sonner';
import { useTranslation } from './TranslationContext';
import { addLanguageToPath } from '@/i18n/languageUtils';

interface AuthContextProps {
  user: User | null;
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLanguage } = useTranslation();

  // Derived state for authentication status
  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          const userData = await getCurrentUser();
          setUser(userData);
        } else {
          setUser(null); // Explicitly set user to null if no token
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        // Avoid redirect here to prevent immediate logout after login
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const loginHandler = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await loginService(email, password);
      const newToken = response.access_token || '';
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(response.user);

      // Use the language parameter in the URL if it exists
      navigate(addLanguageToPath('/dashboard', currentLanguage));
      toast.success('Login successful');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutHandler = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await logoutService();
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      navigate(addLanguageToPath('/login', currentLanguage));
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if server logout fails, clear local data
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      navigate(addLanguageToPath('/login', currentLanguage));
      toast.error('Error during logout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserHandler = (userData: Partial<User>): void => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // Simple permission check function
  const hasPermission = (permission: string): boolean => {
    // For now, just check if the user exists
    // In a real app, this would check user roles or permissions
    return !!user;
  };

  const authContextValue: AuthContextProps = {
    user,
    currentUser: user, // Alias for backward compatibility
    isLoading,
    isAuthenticated,
    token,
    login: loginHandler,
    logout: logoutHandler,
    updateUser: updateUserHandler,
    hasPermission
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
