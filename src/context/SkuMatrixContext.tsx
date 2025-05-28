
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

export interface SkuMatrix {
  id: string;
  name: string;
  description?: string;
  roomId: string;
  roomName?: string;
  rows: SkuMatrixRow[];
  createdAt: string;
  updatedAt: string;
}

export interface SkuMatrixRow {
  id: string;
  skuMatrixId: string;
  label: string;
  color?: string;
  cells: SkuMatrixCell[];
}

export interface SkuMatrixCell {
  id: string;
  skuMatrixRowId: string;
  columnId: string;
  value?: string;
}

interface SkuMatrixContextType {
  skuMatrices: SkuMatrix[];
  loading: boolean;
  error: string | null;
  addSkuMatrix: (skuMatrix: Omit<SkuMatrix, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSkuMatrix: (id: string, updates: Partial<SkuMatrix>) => Promise<void>;
  deleteSkuMatrix: (id: string) => Promise<void>;
  getSkuMatrixById: (id: string) => SkuMatrix | undefined;
  getSkuMatricesByRoomId: (roomId: string) => SkuMatrix[];
  fetchSkuMatrices: () => Promise<void>;
}

const SkuMatrixContext = createContext<SkuMatrixContextType>({} as SkuMatrixContextType);

export const useSkuMatrix = () => useContext(SkuMatrixContext);

export const SkuMatrixProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [skuMatrices, setSkuMatrices] = useState<SkuMatrix[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const fetchSkuMatrices = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.get('/sku-matrices');
      setSkuMatrices(response.data);
    } catch (err: any) {
      console.error('Error fetching SKU matrices:', err);
      setError('Failed to fetch SKU matrices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSkuMatrices();
    }
  }, [user]);

  const getSkuMatrixById = (id: string): SkuMatrix | undefined => {
    return skuMatrices.find(matrix => matrix.id === id);
  };

  const getSkuMatricesByRoomId = (roomId: string): SkuMatrix[] => {
    return skuMatrices.filter(matrix => matrix.roomId === roomId);
  };

  const addSkuMatrix = async (skuMatrix: Omit<SkuMatrix, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.post('/sku-matrices', skuMatrix);
      setSkuMatrices(prev => [...prev, response.data]);
      
      addNotification({
        title: 'New SKU Matrix Added',
        message: `SKU Matrix "${response.data.name}" has been created`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    } catch (err: any) {
      console.error('Error adding SKU matrix:', err);
      setError('Failed to add SKU matrix');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSkuMatrix = async (id: string, updates: Partial<SkuMatrix>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.put(`/sku-matrices/${id}`, updates);
      setSkuMatrices(prev => 
        prev.map(matrix => 
          matrix.id === id ? response.data : matrix
        )
      );
    } catch (err: any) {
      console.error('Error updating SKU matrix:', err);
      setError('Failed to update SKU matrix');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSkuMatrix = async (id: string) => {
    if (!user) return;
    
    const matrixToDelete = skuMatrices.find(matrix => matrix.id === id);
    
    try {
      await apiInstance.delete(`/sku-matrices/${id}`);
      setSkuMatrices(prev => prev.filter(matrix => matrix.id !== id));
      
      if (matrixToDelete) {
        addNotification({
          title: 'SKU Matrix Deleted',
          message: `SKU Matrix "${matrixToDelete.name}" has been removed`,
          type: 'info',
          for: ['1', '2'], // Admin, Manager
        });
      }
    } catch (err: any) {
      console.error('Error deleting SKU matrix:', err);
      setError('Failed to delete SKU matrix');
      throw err;
    }
  };

  return (
    <SkuMatrixContext.Provider value={{ 
      skuMatrices, 
      loading,
      error,
      addSkuMatrix, 
      updateSkuMatrix, 
      deleteSkuMatrix,
      getSkuMatrixById,
      getSkuMatricesByRoomId,
      fetchSkuMatrices
    }}>
      {children}
    </SkuMatrixContext.Provider>
  );
};
