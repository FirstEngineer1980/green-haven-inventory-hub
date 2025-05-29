
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { User } from '../types';
import { apiInstance } from '../api/services/api';

interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  getUserById: (id: string) => User | undefined;
  getRolePermissions: (role: string) => string[];
  fetchUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const useUsers = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.get('/users');
      // Ensure we always set an array, even if response is malformed
      const data = Array.isArray(response.data) ? response.data : [];
      setUsers(data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users');
      // Set empty array on error to prevent map errors
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser]);

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

  const addUser = async (userData: Omit<User, 'id'>) => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.post('/users', userData);
      setUsers(prev => Array.isArray(prev) ? [...prev, response.data] : [response.data]);
    } catch (err: any) {
      console.error('Error adding user:', err);
      setError('Failed to add user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.put(`/users/${id}`, userData);
      setUsers(prev =>
        Array.isArray(prev) ? prev.map(user => (user.id.toString() === id ? response.data : user)) : [response.data]
      );
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError('Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!currentUser) return;
    
    try {
      await apiInstance.delete(`/users/${id}`);
      setUsers(prev => Array.isArray(prev) ? prev.filter(user => user.id.toString() !== id) : []);
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
      throw err;
    }
  };

  const getUserById = (id: string) => {
    return Array.isArray(users) ? users.find(user => user.id.toString() === id) : undefined;
  };

  // Filter users based on current user's role with safety checks
  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    if (!currentUser) return false;
    
    // Admin can see all users
    if (currentUser.role === 'admin') return true;
    
    // Manager can see managers and employees
    if (currentUser.role === 'manager') {
      return user.role === 'manager' || user.role === 'employee' || user.role === 'staff';
    }
    
    // Employee can only see themselves
    return user.id === currentUser.id;
  }) : [];

  const value: UserContextType = {
    users: filteredUsers,
    loading,
    error,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    getRolePermissions,
    fetchUsers,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
