
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Unit } from '../types';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

interface UnitContextType {
  units: Unit[];
  loading: boolean;
  error: string | null;
  addUnit: (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt' | 'roomName' | 'clinicLocationName'>) => Promise<void>;
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
      // Map the backend response to match frontend Unit type
      const unitsData = Array.isArray(response.data) ? response.data.map((unit: any) => ({
        id: unit.id.toString(),
        name: unit.name,
        description: unit.description || '',
        roomId: unit.room_id.toString(),
        roomName: unit.room?.name || 'Unknown Room',
        clinicLocationId: unit.clinic_location_id?.toString() || '1', // Default location
        clinicLocationName: unit.clinic_location?.name || 'Main Location',
        number: unit.number || '',
        capacity: 0, // Default capacity
        currentStock: 0, // Default current stock
        size: parseInt(unit.size) || 0,
        sizeUnit: unit.size_unit || 'sqft',
        status: unit.status || 'available',
        lines: unit.lines || [], // Unit lines
        createdAt: unit.created_at,
        updatedAt: unit.updated_at
      })) : [];
      setUnits(unitsData);
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

  const addUnit = async (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt' | 'roomName' | 'clinicLocationName'>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.post('/units', {
        name: unit.name,
        description: unit.description,
        room_id: unit.roomId,
        clinic_location_id: unit.clinicLocationId,
        number: unit.number,
        size: unit.size?.toString(),
        size_unit: unit.sizeUnit,
        status: unit.status
      });
      
      const newUnit = {
        id: response.data.id.toString(),
        name: response.data.name,
        description: response.data.description || '',
        roomId: response.data.room_id.toString(),
        roomName: response.data.room?.name || 'Unknown Room',
        clinicLocationId: response.data.clinic_location_id?.toString() || unit.clinicLocationId,
        clinicLocationName: response.data.clinic_location?.name || 'Main Location',
        number: response.data.number || '',
        capacity: unit.capacity || 0,
        currentStock: unit.currentStock || 0,
        size: parseInt(response.data.size) || 0,
        sizeUnit: response.data.size_unit || 'sqft',
        status: response.data.status || 'available',
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at
      };
      
      setUnits(prev => [...prev, newUnit]);
      
      addNotification({
        title: 'New Unit Added',
        message: `Unit "${newUnit.number || newUnit.name}" has been added`,
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
      const response = await apiInstance.put(`/units/${id}`, {
        name: updates.name,
        description: updates.description,
        room_id: updates.roomId,
        clinic_location_id: updates.clinicLocationId,
        number: updates.number,
        size: updates.size?.toString(),
        size_unit: updates.sizeUnit,
        status: updates.status
      });
      
      const updatedUnit = {
        id: response.data.id.toString(),
        name: response.data.name,
        description: response.data.description || '',
        roomId: response.data.room_id.toString(),
        roomName: response.data.room?.name || 'Unknown Room',
        clinicLocationId: response.data.clinic_location_id?.toString() || updates.clinicLocationId || '1',
        clinicLocationName: response.data.clinic_location?.name || 'Main Location',
        number: response.data.number || '',
        capacity: updates.capacity || 0,
        currentStock: updates.currentStock || 0,
        size: parseInt(response.data.size) || 0,
        sizeUnit: response.data.size_unit || 'sqft',
        status: response.data.status || 'available',
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at
      };
      
      setUnits(prev => 
        prev.map(unit => 
          unit.id === id ? updatedUnit : unit
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
