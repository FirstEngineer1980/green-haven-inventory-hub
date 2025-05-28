
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  getRolePermissions: (role: string) => string[];
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const useUsers = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Initialize with mock data - in a real app, this would fetch from API
    setUsers(mockUsers);
  }, []);

  const getRolePermissions = (role: string): string[] => {
    switch (role) {
      case 'admin':
        return ['manage_users', 'manage_products', 'view_reports', 'manage_inventory', 'manage_notifications'];
      case 'manager':
        return ['manage_products', 'view_reports', 'manage_inventory'];
      case 'staff':
        return ['manage_products', 'manage_inventory'];
      case 'viewer':
        return ['view_reports'];
      default:
        return [];
    }
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prev =>
      prev.map(user => (user.id === id ? { ...user, ...userData } : user))
    );
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  // Filter users based on current user's role
  const filteredUsers = users.filter(user => {
    if (!currentUser) return false;
    
    // Admin can see all users
    if (currentUser.role === 'admin') return true;
    
    // Manager can see managers and employees
    if (currentUser.role === 'manager') {
      return user.role === 'manager' || user.role === 'employee' || user.role === 'staff';
    }
    
    // Employee can only see themselves
    return user.id === currentUser.id;
  });

  const value: UserContextType = {
    users: filteredUsers,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    getRolePermissions,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
