
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Unit } from '../types';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

interface UnitContextType {
  units: Unit[];
  loading: boolean;
  error: string | null;
  addUnit: (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt' | 'roomName'>) => Promise<void>;
  updateUnit: (id: string, updates: Partial<Unit>) => Promise<void>;
  deleteUnit: (id: string) => Promise<void>;
  getUnitsByRoomId: (roomId: string) => Unit[];
  getUnitById: (id: string) => Unit | undefined;
  fetchUnits: () => Promise<void>;
}

const UnitContext = createContext<UnitContextType>({} as UnitContextType);

export const useUnits = () => useContext(UnitContext);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const fetchUnits = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.get('/units');
      setUnits(response.data);
    } catch (err: any) {
      console.error('Error fetching units:', err);
      setError('Failed to fetch units');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnits();
    }
  }, [user]);

  const getUnitById = (id: string): Unit | undefined => {
    return units.find(unit => unit.id === id);
  };

  const addUnit = async (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt' | 'roomName'>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.post('/units', unit);
      setUnits(prev => [...prev, response.data]);
      
      addNotification({
        title: 'New Unit Added',
        message: `Unit "${response.data.number || response.data.name}" has been added`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    } catch (err: any) {
      console.error('Error adding unit:', err);
      setError('Failed to add unit');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUnit = async (id: string, updates: Partial<Unit>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.put(`/units/${id}`, updates);
      setUnits(prev => 
        prev.map(unit => 
          unit.id === id ? response.data : unit
        )
      );
    } catch (err: any) {
      console.error('Error updating unit:', err);
      setError('Failed to update unit');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUnit = async (id: string) => {
    if (!user) return;
    
    const unitToDelete = units.find(unit => unit.id === id);
    
    try {
      await apiInstance.delete(`/units/${id}`);
      setUnits(prev => prev.filter(unit => unit.id !== id));
      
      if (unitToDelete) {
        addNotification({
          title: 'Unit Deleted',
          message: `Unit "${unitToDelete.number || unitToDelete.name}" has been removed`,
          type: 'info',
          for: ['1', '2'], // Admin, Manager
        });
      }
    } catch (err: any) {
      console.error('Error deleting unit:', err);
      setError('Failed to delete unit');
      throw err;
    }
  };

  const getUnitsByRoomId = (roomId: string): Unit[] => {
    return units.filter(unit => unit.roomId === roomId);
  };

  return (
    <UnitContext.Provider value={{ 
      units, 
      loading,
      error,
      addUnit, 
      updateUnit, 
      deleteUnit,
      getUnitsByRoomId,
      getUnitById,
      fetchUnits
    }}>
      {children}
    </UnitContext.Provider>
  );
};
