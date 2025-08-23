
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Room } from '../types';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

interface RoomContextType {
  rooms: Room[];
  loading: boolean;
  error: string | null;
  addRoom: (room: Omit<Room, 'id' | 'customerName' | 'clinicLocationName' | 'createdAt' | 'updatedAt'>) => Promise<void>;
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
      // Map the backend response to match frontend Room type
      const roomsData = Array.isArray(response.data) ? response.data.map((room: any) => ({
        id: room.id.toString(),
        name: room.name,
        description: room.description || '',
        customerId: room.customer_id.toString(),
        customerName: room.customer?.name || 'Unknown Customer',
        clinicLocationId: room.clinic_location_id?.toString() || '1', // Default location
        clinicLocationName: room.clinic_location?.name || 'Main Location',
        capacity: 100, // Default capacity
        unit: '', // Default unit
        units: [], // Initialize empty units array
        createdAt: room.created_at,
        updatedAt: room.updated_at
      })) : [];
      setRooms(roomsData);
    } catch (err: any) {
      console.error('Error fetching rooms:', err);
      setError('Failed to fetch rooms');
      setRooms([]);
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
    return Array.isArray(rooms) ? rooms.find(room => room.id === id) : undefined;
  };

  const addRoom = async (room: Omit<Room, 'id' | 'customerName' | 'clinicLocationName' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.post('/rooms', {
        name: room.name,
        description: room.description,
        customer_id: room.customerId,
        clinic_location_id: room.clinicLocationId
      });
      
      const newRoom = {
        id: response.data.id.toString(),
        name: response.data.name,
        description: response.data.description || '',
        customerId: response.data.customer_id.toString(),
        customerName: response.data.customer?.name || 'Unknown Customer',
        clinicLocationId: response.data.clinic_location_id?.toString() || room.clinicLocationId,
        clinicLocationName: response.data.clinic_location?.name || 'Main Location',
        capacity: room.capacity || 100,
        unit: room.unit || '',
        units: [],
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at
      };
      
      setRooms(prev => Array.isArray(prev) ? [...prev, newRoom] : [newRoom]);
      
      addNotification({
        title: 'New Room Added',
        message: `Room "${newRoom.name}" has been added`,
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
      const response = await apiInstance.put(`/rooms/${id}`, {
        name: updates.name,
        description: updates.description,
        customer_id: updates.customerId,
        clinic_location_id: updates.clinicLocationId
      });
      
      const updatedRoom = {
        id: response.data.id.toString(),
        name: response.data.name,
        description: response.data.description || '',
        customerId: response.data.customer_id.toString(),
        customerName: response.data.customer?.name || 'Unknown Customer',
        clinicLocationId: response.data.clinic_location_id?.toString() || updates.clinicLocationId || '1',
        clinicLocationName: response.data.clinic_location?.name || 'Main Location',
        capacity: updates.capacity || 100,
        unit: updates.unit || '',
        units: updates.units || [],
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at
      };
      
      setRooms(prev => 
        Array.isArray(prev) ? prev.map(room => 
          room.id === id ? updatedRoom : room
        ) : [updatedRoom]
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
    
    const roomToDelete = Array.isArray(rooms) ? rooms.find(room => room.id === id) : null;
    
    try {
      await apiInstance.delete(`/rooms/${id}`);
      setRooms(prev => Array.isArray(prev) ? prev.filter(room => room.id !== id) : []);
      
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
    return Array.isArray(rooms) ? rooms.filter(room => room.customerId === customerId) : [];
  };

  return (
    <RoomContext.Provider value={{ 
      rooms: Array.isArray(rooms) ? rooms : [], 
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
