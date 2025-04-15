
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, Permission } from '@/types';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('currentUser');
    
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
        
        // Set the authorization header for all future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Login function - connect to the backend API
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // For demo accounts with no password check
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
      
      // Regular login for non-demo accounts
      const response = await axios.post('/api/login', { email, password });
      const { user, token } = response.data;
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      // Set the authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    
    // Remove the authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Check if user has a specific permission
  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser) return false;
    return currentUser.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      currentUser, 
      login, 
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};
