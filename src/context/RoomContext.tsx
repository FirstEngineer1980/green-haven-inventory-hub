
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Room } from '../types';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

interface RoomContextType {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  addRoom: (room: Omit<Room, 'id' | 'customerName' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRoom: (id: string, updates: Partial<Room>) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
  getRoomsByCustomerId: (customerId: string) => Room[];
  getRoomById: (id: string) => Room | undefined;
  fetchRooms: () => Promise<void>;
}

const RoomContext = createContext<RoomContextType>({} as RoomContextType);

export const useRooms = () => useContext(RoomContext);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const fetchRooms = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.get('/rooms');
      setRooms(response.data);
    } catch (err: any) {
      console.error('Error fetching rooms:', err);
      setError('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  const getRoomById = (id: string): Room | undefined => {
    return rooms.find(room => room.id === id);
  };

  const addRoom = async (room: Omit<Room, 'id' | 'customerName' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.post('/rooms', room);
      setRooms(prev => [...prev, response.data]);
      
      addNotification({
        title: 'New Room Added',
        message: `Room "${response.data.name}" has been added`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    } catch (err: any) {
      console.error('Error adding room:', err);
      setError('Failed to add room');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRoom = async (id: string, updates: Partial<Room>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.put(`/rooms/${id}`, updates);
      setRooms(prev => 
        prev.map(room => 
          room.id === id ? response.data : room
        )
      );
    } catch (err: any) {
      console.error('Error updating room:', err);
      setError('Failed to update room');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRoom = async (id: string) => {
    if (!user) return;
    
    const roomToDelete = rooms.find(room => room.id === id);
    
    try {
      await apiInstance.delete(`/rooms/${id}`);
      setRooms(prev => prev.filter(room => room.id !== id));
      
      if (roomToDelete) {
        addNotification({
          title: 'Room Deleted',
          message: `Room "${roomToDelete.name}" has been removed from the system`,
          type: 'info',
          for: ['1', '2'], // Admin, Manager
        });
      }
    } catch (err: any) {
      console.error('Error deleting room:', err);
      setError('Failed to delete room');
      throw err;
    }
  };

  const getRoomsByCustomerId = (customerId: string): Room[] => {
    return rooms.filter(room => room.customerId === customerId);
  };

  return (
    <RoomContext.Provider value={{ 
      rooms, 
      loading,
      error,
      addRoom, 
      updateRoom, 
      deleteRoom,
      getRoomsByCustomerId,
      getRoomById,
      fetchRooms
    }}>
      {children}
    </RoomContext.Provider>
  );
};
