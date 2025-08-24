import React, { createContext, useState, useContext, useEffect } from 'react';
import { UnitLine } from '../types';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

interface UnitLineContextType {
  unitLines: UnitLine[];
  loading: boolean;
  error: string | null;
  addUnitLine: (unitLine: Omit<UnitLine, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateUnitLine: (id: string, updates: Partial<UnitLine>) => Promise<void>;
  deleteUnitLine: (id: string) => Promise<void>;
  getUnitLinesByUnitId: (unitId: string) => UnitLine[];
  getUnitLineById: (id: string) => UnitLine | undefined;
  fetchUnitLines: (unitId?: string) => Promise<void>;
}

const UnitLineContext = createContext<UnitLineContextType>({} as UnitLineContextType);

export const useUnitLines = () => useContext(UnitLineContext);

export const UnitLineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unitLines, setUnitLines] = useState<UnitLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const fetchUnitLines = async (unitId?: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const url = unitId ? `/unit-lines?unit_id=${unitId}` : '/unit-lines';
      const response = await apiInstance.get(url);
      
      const unitLinesData = Array.isArray(response.data) ? response.data.map((line: any) => ({
        id: line.id.toString(),
        unitId: line.unit_id.toString(),
        name: line.name,
        description: line.description || '',
        capacity: line.capacity || 0,
        currentStock: line.current_stock || 0,
        position: line.position || 0,
        createdAt: line.created_at,
        updatedAt: line.updated_at
      })) : [];
      
      setUnitLines(unitLinesData);
    } catch (err: any) {
      console.error('Error fetching unit lines:', err);
      setError('Failed to fetch unit lines');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUnitLines();
    }
  }, [user]);

  const getUnitLineById = (id: string): UnitLine | undefined => {
    return unitLines.find(line => line.id === id);
  };

  const addUnitLine = async (unitLine: Omit<UnitLine, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.post('/unit-lines', {
        unit_id: unitLine.unitId,
        name: unitLine.name,
        description: unitLine.description,
        capacity: unitLine.capacity,
        current_stock: unitLine.currentStock,
        position: unitLine.position
      });
      
      const newUnitLine = {
        id: response.data.id.toString(),
        unitId: response.data.unit_id.toString(),
        name: response.data.name,
        description: response.data.description || '',
        capacity: response.data.capacity || 0,
        currentStock: response.data.current_stock || 0,
        position: response.data.position || 0,
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at
      };
      
      setUnitLines(prev => [...prev, newUnitLine]);
      
      addNotification({
        title: 'New Unit Line Added',
        message: `Line "${newUnitLine.name}" has been added`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    } catch (err: any) {
      console.error('Error adding unit line:', err);
      setError('Failed to add unit line');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUnitLine = async (id: string, updates: Partial<UnitLine>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.put(`/unit-lines/${id}`, {
        name: updates.name,
        description: updates.description,
        capacity: updates.capacity,
        current_stock: updates.currentStock,
        position: updates.position
      });
      
      const updatedUnitLine = {
        id: response.data.id.toString(),
        unitId: response.data.unit_id.toString(),
        name: response.data.name,
        description: response.data.description || '',
        capacity: response.data.capacity || 0,
        currentStock: response.data.current_stock || 0,
        position: response.data.position || 0,
        createdAt: response.data.created_at,
        updatedAt: response.data.updated_at
      };
      
      setUnitLines(prev => 
        prev.map(line => 
          line.id === id ? updatedUnitLine : line
        )
      );
    } catch (err: any) {
      console.error('Error updating unit line:', err);
      setError('Failed to update unit line');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUnitLine = async (id: string) => {
    if (!user) return;
    
    const lineToDelete = unitLines.find(line => line.id === id);
    
    try {
      await apiInstance.delete(`/unit-lines/${id}`);
      setUnitLines(prev => prev.filter(line => line.id !== id));
      
      if (lineToDelete) {
        addNotification({
          title: 'Unit Line Deleted',
          message: `Line "${lineToDelete.name}" has been removed`,
          type: 'info',
          for: ['1', '2'], // Admin, Manager
        });
      }
    } catch (err: any) {
      console.error('Error deleting unit line:', err);
      setError('Failed to delete unit line');
      throw err;
    }
  };

  const getUnitLinesByUnitId = (unitId: string): UnitLine[] => {
    return unitLines.filter(line => line.unitId === unitId).sort((a, b) => a.position - b.position);
  };

  return (
    <UnitLineContext.Provider value={{ 
      unitLines, 
      loading,
      error,
      addUnitLine, 
      updateUnitLine, 
      deleteUnitLine,
      getUnitLinesByUnitId,
      getUnitLineById,
      fetchUnitLines
    }}>
      {children}
    </UnitLineContext.Provider>
  );
};