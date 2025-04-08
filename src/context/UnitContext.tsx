
import React, { createContext, useState, useContext } from 'react';
import { Unit, Room } from '../types';
import { useNotifications } from './NotificationContext';
import { useRooms } from './RoomContext';

// Mock unit data
const mockUnits: Unit[] = [
  {
    id: '1',
    roomId: '1',
    roomName: 'Storage Room A',
    number: 'U101',
    size: 150,
    sizeUnit: 'sqft',
    status: 'occupied',
    description: 'Corner unit with good ventilation',
    createdAt: '2023-05-10T09:30:00Z',
    updatedAt: '2023-08-15T11:45:00Z'
  },
  {
    id: '2',
    roomId: '2',
    roomName: 'Warehouse Space',
    number: 'U203',
    size: 350,
    sizeUnit: 'sqft',
    status: 'available',
    description: 'Large unit suitable for bulky items',
    createdAt: '2023-06-20T14:15:00Z',
    updatedAt: '2023-09-05T16:20:00Z'
  },
  {
    id: '3',
    roomId: '3',
    roomName: 'Garden Shed',
    number: 'U105',
    size: 75,
    sizeUnit: 'sqft',
    status: 'maintenance',
    description: 'Undergoing repairs',
    createdAt: '2023-07-18T10:40:00Z',
    updatedAt: '2023-10-02T13:30:00Z'
  }
];

interface UnitContextType {
  units: Unit[];
  addUnit: (unit: Omit<Unit, 'id' | 'roomName' | 'createdAt' | 'updatedAt'>) => void;
  updateUnit: (id: string, updates: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;
  getUnitsByRoomId: (roomId: string) => Unit[];
}

const UnitContext = createContext<UnitContextType>({} as UnitContextType);

export const useUnits = () => useContext(UnitContext);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const { addNotification } = useNotifications();
  const { rooms } = useRooms();

  const getRoomName = (roomId: string): string => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Unknown Room';
  };

  const addUnit = (unit: Omit<Unit, 'id' | 'roomName' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const roomName = getRoomName(unit.roomId);
    
    const newUnit: Unit = {
      ...unit,
      id: Date.now().toString(),
      roomName,
      createdAt: now,
      updatedAt: now
    };
    
    setUnits(prev => [...prev, newUnit]);
    
    // Send notification about new unit
    addNotification({
      title: 'New Unit Added',
      message: `Unit "${newUnit.number}" has been added to ${roomName}`,
      type: 'info',
      for: ['1', '2'], // Admin, Manager
    });
  };

  const updateUnit = (id: string, updates: Partial<Unit>) => {
    setUnits(prev => 
      prev.map(unit => 
        unit.id === id 
          ? { 
              ...unit, 
              ...updates, 
              roomName: updates.roomId ? getRoomName(updates.roomId) : unit.roomName,
              updatedAt: new Date().toISOString() 
            } 
          : unit
      )
    );
    
    // Get the updated unit
    const updatedUnit = units.find(u => u.id === id);
    if (updatedUnit) {
      // Send notification about update
      addNotification({
        title: 'Unit Updated',
        message: `Unit "${updatedUnit.number}" has been updated`,
        type: 'success',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

  const deleteUnit = (id: string) => {
    // Get the unit before deleting
    const unitToDelete = units.find(u => u.id === id);
    
    setUnits(prev => prev.filter(unit => unit.id !== id));
    
    if (unitToDelete) {
      addNotification({
        title: 'Unit Deleted',
        message: `Unit "${unitToDelete.number}" has been removed from ${unitToDelete.roomName}`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

  const getUnitsByRoomId = (roomId: string): Unit[] => {
    return units.filter(unit => unit.roomId === roomId);
  };

  return (
    <UnitContext.Provider value={{ 
      units, 
      addUnit, 
      updateUnit, 
      deleteUnit,
      getUnitsByRoomId
    }}>
      {children}
    </UnitContext.Provider>
  );
};
