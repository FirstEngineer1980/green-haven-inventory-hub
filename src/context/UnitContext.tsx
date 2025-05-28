
import React, { createContext, useState, useContext } from 'react';
import { Unit } from '../types';
import { useRooms } from './RoomContext';
import { useNotifications } from './NotificationContext';

// Mock units data
const mockUnits: Unit[] = [
  {
    id: '1',
    name: 'Storage Unit A1',
    number: 'A101',
    roomId: '1',
    roomName: 'Storage Room A',
    capacity: 100,
    currentStock: 75,
    size: 100,
    sizeUnit: 'sqft',
    status: 'available',
    description: 'Standard storage unit with climate control',
    createdAt: '2023-04-20T09:45:00Z',
    updatedAt: '2023-07-15T13:30:00Z'
  },
  {
    id: '2',
    name: 'Warehouse Unit W2',
    number: 'W203',
    roomId: '2',
    roomName: 'Warehouse Space',
    capacity: 500,
    currentStock: 300,
    size: 500,
    sizeUnit: 'sqft',
    status: 'occupied',
    description: 'Large warehouse unit for bulky items',
    createdAt: '2023-05-25T11:20:00Z',
    updatedAt: '2023-08-10T16:15:00Z'
  },
  {
    id: '3',
    name: 'Garden Shed Unit G3',
    number: 'G105',
    roomId: '3',
    roomName: 'Garden Shed',
    capacity: 25,
    currentStock: 10,
    size: 25,
    sizeUnit: 'sqm',
    status: 'maintenance',
    description: 'Small unit for garden tools and equipment',
    createdAt: '2023-06-22T14:50:00Z',
    updatedAt: '2023-09-05T10:40:00Z'
  }
];

interface UnitContextType {
  units: Unit[];
  addUnit: (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt' | 'roomName'>) => void;
  updateUnit: (id: string, updates: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;
  getUnitsByRoomId: (roomId: string) => Unit[];
  getUnitById: (id: string) => Unit | undefined;
}

const UnitContext = createContext<UnitContextType>({} as UnitContextType);

export const useUnits = () => useContext(UnitContext);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const { getRoomById } = useRooms();
  const { addNotification } = useNotifications();

  const getUnitById = (id: string): Unit | undefined => {
    return units.find(unit => unit.id === id);
  };

  const addUnit = (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt' | 'roomName'>) => {
    const now = new Date().toISOString();
    const room = getRoomById(unit.roomId);
    
    const newUnit: Unit = {
      ...unit,
      id: Date.now().toString(),
      roomName: room ? room.name : 'Unknown Room',
      createdAt: now,
      updatedAt: now
    };
    
    setUnits(prev => [...prev, newUnit]);
    
    // Send notification about new unit
    addNotification({
      title: 'New Unit Added',
      message: `Unit "${newUnit.number}" has been added to ${newUnit.roomName}`,
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
              roomName: updates.roomId ? (getRoomById(updates.roomId)?.name || 'Unknown Room') : unit.roomName,
              updatedAt: new Date().toISOString() 
            } 
          : unit
      )
    );
  };

  const deleteUnit = (id: string) => {
    const unitToDelete = units.find(unit => unit.id === id);
    
    if (unitToDelete) {
      setUnits(prev => prev.filter(unit => unit.id !== id));
      
      // Send notification about unit deletion
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
      getUnitsByRoomId,
      getUnitById
    }}>
      {children}
    </UnitContext.Provider>
  );
};
