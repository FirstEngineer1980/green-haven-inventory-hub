
import React, { createContext, useState, useContext } from 'react';
import { Room, Customer } from '../types';
import { useNotifications } from './NotificationContext';
import { useCustomers } from './CustomerContext';

// Mock room data
const mockRooms: Room[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Jane Smith',
    name: 'Storage Room A',
    unit: 101,
    createdAt: '2023-04-15T08:30:00Z',
    updatedAt: '2023-07-10T11:45:00Z'
  },
  {
    id: '2',
    customerId: '3',
    customerName: 'Emily Davis',
    name: 'Warehouse Space',
    unit: 203,
    createdAt: '2023-05-22T09:15:00Z',
    updatedAt: '2023-08-05T14:20:00Z'
  },
  {
    id: '3',
    customerId: '2',
    customerName: 'Michael Johnson',
    name: 'Garden Shed',
    unit: 105,
    createdAt: '2023-06-18T13:40:00Z',
    updatedAt: '2023-09-02T10:30:00Z'
  }
];

interface RoomContextType {
  rooms: Room[];
  addRoom: (room: Omit<Room, 'id' | 'customerName' | 'createdAt' | 'updatedAt'>) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  deleteRoom: (id: string) => void;
  getRoomsByCustomerId: (customerId: string) => Room[];
}

const RoomContext = createContext<RoomContextType>({} as RoomContextType);

export const useRooms = () => useContext(RoomContext);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const { addNotification } = useNotifications();
  const { customers } = useCustomers();

  const getCustomerName = (customerId: string): string => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  const addRoom = (room: Omit<Room, 'id' | 'customerName' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const customerName = getCustomerName(room.customerId);
    
    const newRoom: Room = {
      ...room,
      id: Date.now().toString(),
      customerName,
      createdAt: now,
      updatedAt: now
    };
    
    setRooms(prev => [...prev, newRoom]);
    
    // Send notification about new room
    addNotification({
      title: 'New Room Added',
      message: `Room "${newRoom.name}" has been added for ${customerName}`,
      type: 'info',
      for: ['1', '2'], // Admin, Manager
    });
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(prev => 
      prev.map(room => 
        room.id === id 
          ? { 
              ...room, 
              ...updates, 
              customerName: updates.customerId ? getCustomerName(updates.customerId) : room.customerName,
              updatedAt: new Date().toISOString() 
            } 
          : room
      )
    );
    
    // Get the updated room
    const updatedRoom = rooms.find(r => r.id === id);
    if (updatedRoom) {
      // Send notification about update
      addNotification({
        title: 'Room Updated',
        message: `Room "${updatedRoom.name}" has been updated`,
        type: 'success',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

  const deleteRoom = (id: string) => {
    // Get the room before deleting
    const roomToDelete = rooms.find(r => r.id === id);
    
    setRooms(prev => prev.filter(room => room.id !== id));
    
    if (roomToDelete) {
      addNotification({
        title: 'Room Deleted',
        message: `Room "${roomToDelete.name}" has been removed for ${roomToDelete.customerName}`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

  const getRoomsByCustomerId = (customerId: string): Room[] => {
    return rooms.filter(room => room.customerId === customerId);
  };

  return (
    <RoomContext.Provider value={{ 
      rooms, 
      addRoom, 
      updateRoom, 
      deleteRoom,
      getRoomsByCustomerId
    }}>
      {children}
    </RoomContext.Provider>
  );
};
