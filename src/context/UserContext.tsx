
import React, { createContext, useState, useContext } from 'react';
import { User, Role, Permission } from '../types';
import { mockUsers } from '../data/mockData';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';

interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'lastActive'>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getRolePermissions: (role: Role) => Permission[];
}

const UserContext = createContext<UserContextType>({} as UserContextType);

export const useUsers = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  // Define default permissions for each role
  const rolePermissions: Record<Role, Permission[]> = {
    admin: ['manage_users', 'manage_products', 'view_reports', 'manage_inventory', 'manage_notifications'],
    manager: ['manage_products', 'view_reports', 'manage_inventory'],
    staff: ['view_reports', 'manage_inventory'],
    viewer: ['view_reports']
  };
  
  const getRolePermissions = (role: Role): Permission[] => {
    return rolePermissions[role] || [];
  };

  const addUser = (user: Omit<User, 'id' | 'createdAt' | 'lastActive'>) => {
    const now = new Date().toISOString();
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: now,
      lastActive: now
    };
    
    setUsers(prev => [...prev, newUser]);
    
    // Send notification about new user
    if (user) {
      addNotification({
        title: 'User Added',
        message: `New user ${newUser.name} has been added to the system`,
        type: 'info',
        for: ['admin'], // Admin only
      });
    }
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const userToUpdate = users.find(u => u.id === id);
    
    setUsers(prev => 
      prev.map(user => 
        user.id === id 
          ? { ...user, ...updates } 
          : user
      )
    );
    
    if (userToUpdate && user) {
      // Send notification about update
      addNotification({
        title: 'User Updated',
        message: `User ${userToUpdate.name} has been updated`,
        type: 'info',
        for: ['admin'], // Admin only
      });
    }
  };

  const deleteUser = (id: string) => {
    // Get the user before deleting
    const userToDelete = users.find(u => u.id === id);
    
    // Don't allow deleting the current user
    if (user && id === user.id) {
      return;
    }
    
    setUsers(prev => prev.filter(user => user.id !== id));
    
    if (userToDelete && user) {
      addNotification({
        title: 'User Deleted',
        message: `User ${userToDelete.name} has been removed from the system`,
        type: 'info',
        for: ['admin'], // Admin only
      });
    }
  };

  return (
    <UserContext.Provider value={{ 
      users, 
      addUser, 
      updateUser, 
      deleteUser,
      getRolePermissions
    }}>
      {children}
    </UserContext.Provider>
  );
};
