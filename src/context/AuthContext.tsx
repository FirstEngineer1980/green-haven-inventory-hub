
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Permission } from '@/types';
import axios from 'axios';
import { authAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface UpdateUserParams {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  currentPassword?: string;
  newPassword?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  updateUser: (userData: UpdateUserParams) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  currentUser: null,
  login: () => Promise.resolve(false),
  logout: () => {},
  hasPermission: () => false,
  updateUser: () => Promise.resolve(false)
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('currentUser');
      
      if (token) {
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          try {
            const response = await authAPI.getUser();
            setCurrentUser(response);
            localStorage.setItem('currentUser', JSON.stringify(response));
            setIsAuthenticated(true);
          } catch (error) {
            console.error('Failed to fetch user data:', error);
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      if (email.includes('@greenhaven.com') || email.includes('@example.com')) {
        if (email === 'admin@example.com' || email === 'admin@greenhaven.com') {
          const demoUser: User = {
            id: '1',
            name: 'Admin User',
            email: email,
            role: 'admin',
            permissions: ['manage_users', 'manage_products', 'view_reports', 'manage_inventory', 'manage_notifications'],
            avatar: 'https://i.pravatar.cc/150?img=1',
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
          };
          setCurrentUser(demoUser);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(demoUser));
          localStorage.setItem('token', 'demo-token-admin');
          
          toast({
            title: "Login successful",
            description: `Welcome back, ${demoUser.name}!`,
          });
          
          return true;
        } else if (email === 'manager@example.com' || email === 'john@greenhaven.com') {
          const demoUser: User = {
            id: '2',
            name: 'Manager User',
            email: email,
            role: 'manager',
            permissions: ['manage_products', 'view_reports', 'manage_inventory'],
            avatar: 'https://i.pravatar.cc/150?img=2',
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
          };
          setCurrentUser(demoUser);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(demoUser));
          localStorage.setItem('token', 'demo-token-manager');
          return true;
        } else if (email === 'staff@example.com' || email === 'sarah@greenhaven.com') {
          const demoUser: User = {
            id: '3',
            name: 'Staff User',
            email: email,
            role: 'staff',
            permissions: ['view_reports', 'manage_inventory'],
            avatar: 'https://i.pravatar.cc/150?img=3',
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
          };
          setCurrentUser(demoUser);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(demoUser));
          localStorage.setItem('token', 'demo-token-staff');
          return true;
        } else if (email === 'viewer@example.com' || email === 'michael@greenhaven.com') {
          const demoUser: User = {
            id: '4',
            name: 'Viewer User',
            email: email,
            role: 'viewer',
            permissions: ['view_reports'],
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
          };
          setCurrentUser(demoUser);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(demoUser));
          localStorage.setItem('token', 'demo-token-viewer');
          return true;
        }
      }
      
      try {
        const response = await authAPI.login(email, password);
        localStorage.setItem('token', response.token);
        setCurrentUser(response.user);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        setIsAuthenticated(true);
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${response.user.name}!`,
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
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: UpdateUserParams): Promise<boolean> => {
    try {
      if (currentUser && currentUser.email.includes('@greenhaven.com') || currentUser?.email.includes('@example.com')) {
        const updatedUser = { ...currentUser, ...userData };
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return true;
      }
      
      const response = await axios.put(`/api/users/${currentUser?.id}`, userData);
      const updatedUser = response.data;
      
      setCurrentUser(prev => prev ? { ...prev, ...updatedUser } : null);
      localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, ...updatedUser }));
      
      return true;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    
    try {
      authAPI.logout().catch(err => console.error('Logout API error:', err));
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser) return false;
    return currentUser.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      currentUser,
      login,
      logout,
      hasPermission,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
