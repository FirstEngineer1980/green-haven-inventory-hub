
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
  binId?: string;
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

  const transformBackendSkuMatrix = (backendData: any): SkuMatrix => {
    return {
      id: backendData.id?.toString() || '',
      name: backendData.name || '',
      description: backendData.description || '',
      roomId: backendData.room_id?.toString() || backendData.roomId || '',
      roomName: backendData.room?.name || backendData.roomName || '',
      rows: Array.isArray(backendData.rows)
        ? backendData.rows.map((row: any) => ({
            id: row.id?.toString() || '',
            skuMatrixId: row.sku_matrix_id?.toString() || row.skuMatrixId || '',
            label: row.label || '',
            color: row.color || '#FFFFFF',
            cells: Array.isArray(row.cells)
              ? row.cells.map((cell: any) => ({
                  id: cell.id?.toString() || '',
                  skuMatrixRowId: cell.sku_matrix_row_id?.toString() || cell.skuMatrixRowId || '',
                  columnId: cell.column_id || cell.columnId || '',
                  value: cell.value || '',
                  binId: cell.bin_id || cell.binId || ''
                }))
              : []
          }))
        : [],
      createdAt: backendData.created_at || backendData.createdAt || new Date().toISOString(),
      updatedAt: backendData.updated_at || backendData.updatedAt || new Date().toISOString()
    };
  };

  const fetchSkuMatrices = useCallback(async () => {
    if (!user || loading) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching SKU matrices from API...');
      const response = await apiInstance.get('/sku-matrices');
      console.log('Raw SKU matrices response:', response.data);
      
      // Ensure we always set an array, even if response is malformed
      const data = Array.isArray(response.data) ? response.data : [];
      const transformedData = data.map(transformBackendSkuMatrix);
      console.log('Transformed SKU matrices:', transformedData);
      
      setSkuMatrices(transformedData);
    } catch (err: any) {
      console.error('Error fetching SKU matrices:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch SKU matrices';
      setError(errorMessage);
      // Set empty array on error to prevent map errors
      setSkuMatrices([]);
    } finally {
      setLoading(false);
    }
  }, [user, loading]);

  const getSkuMatrixById = (id: string): SkuMatrix | undefined => {
    return Array.isArray(skuMatrices) ? skuMatrices.find(matrix => matrix.id === id) : undefined;
  };

  const getSkuMatricesByRoomId = (roomId: string): SkuMatrix[] => {
    return Array.isArray(skuMatrices) ? skuMatrices.filter(matrix => matrix.roomId === roomId) : [];
  };

  const addSkuMatrix = async (skuMatrix: Omit<SkuMatrix, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log('Adding SKU matrix:', skuMatrix);
      
      const backendData = {
        name: skuMatrix.name,
        description: skuMatrix.description || '',
        room_id: skuMatrix.roomId
      };
      
      const response = await apiInstance.post('/sku-matrices', backendData);
      const transformedMatrix = transformBackendSkuMatrix(response.data);
      
      setSkuMatrices(prev => Array.isArray(prev) ? [...prev, transformedMatrix] : [transformedMatrix]);
      
      addNotification({
        title: 'New SKU Matrix Added',
        message: `SKU Matrix "${transformedMatrix.name}" has been created`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    } catch (err: any) {
      console.error('Error adding SKU matrix:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add SKU matrix';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateSkuMatrix = async (id: string, updates: Partial<SkuMatrix>) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log('Updating SKU matrix:', id, updates);
      
      const backendData: any = {};
      if (updates.name !== undefined) backendData.name = updates.name;
      if (updates.description !== undefined) backendData.description = updates.description;
      if (updates.roomId !== undefined) backendData.room_id = updates.roomId;
      
      const response = await apiInstance.put(`/sku-matrices/${id}`, backendData);
      const transformedMatrix = transformBackendSkuMatrix(response.data);
      
      setSkuMatrices(prev => 
        Array.isArray(prev) ? prev.map(matrix => 
          matrix.id === id ? transformedMatrix : matrix
        ) : [transformedMatrix]
      );
    } catch (err: any) {
      console.error('Error updating SKU matrix:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update SKU matrix';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteSkuMatrix = async (id: string) => {
    if (!user) return;
    
    const matrixToDelete = Array.isArray(skuMatrices) ? skuMatrices.find(matrix => matrix.id === id) : null;
    
    setLoading(true);
    setError(null);
    try {
      await apiInstance.delete(`/sku-matrices/${id}`);
      setSkuMatrices(prev => Array.isArray(prev) ? prev.filter(matrix => matrix.id !== id) : []);
      
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
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete SKU matrix';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SkuMatrixContext.Provider value={{ 
      skuMatrices: Array.isArray(skuMatrices) ? skuMatrices : [], 
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
