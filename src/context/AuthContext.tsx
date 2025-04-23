import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Permission } from '@/types';
import axios from 'axios';

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
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
      
      const response = await axios.post('/api/login', { email, password });
      const { user, token } = response.data;
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
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
    
    delete axios.defaults.headers.common['Authorization'];
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
