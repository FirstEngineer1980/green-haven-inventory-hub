
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Notification } from '../types';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.get('/notifications');
      setNotifications(response.data.data || []);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    if (!user) return;
    
    try {
      const response = await apiInstance.post('/notifications', {
        ...notification,
        user_id: user.id,
      });
      setNotifications(prev => [response.data.data, ...prev]);
    } catch (err: any) {
      console.error('Error adding notification:', err);
      // Fallback to local notification
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        read: false,
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiInstance.put(`/notifications/${id}/mark-as-read`);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      // Fallback to local update
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiInstance.put('/notifications/mark-all-as-read');
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
      // Fallback to local update
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    }
  };

  const removeNotification = async (id: string) => {
    try {
      await apiInstance.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (err: any) {
      console.error('Error removing notification:', err);
      // Fallback to local removal
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Filter notifications based on user roles
  const filteredNotifications = notifications.filter(notification => {
    if (!user) return false;
    return notification.for?.includes(user.role) || notification.for?.includes(user.id);
  });

  const value: NotificationContextType = {
    notifications: filteredNotifications,
    unreadCount,
    loading,
    error,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
