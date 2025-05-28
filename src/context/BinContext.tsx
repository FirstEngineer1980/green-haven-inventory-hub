
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Bin } from '../types';
import { useAuth } from './AuthContext';
import apiInstance from '../api/services/api';

interface BinContextProps {
  bins: Bin[];
  loading: boolean;
  error: string | null;
  fetchBins: () => Promise<void>;
  addBin: (bin: Omit<Bin, 'id' | 'createdAt' | 'updatedAt' | 'volumeCapacity'>) => Promise<void>;
  updateBin: (id: string, bin: Partial<Bin>) => Promise<void>;
  deleteBin: (id: string) => Promise<void>;
  getBinsByUnitMatrix: (unitMatrixId: string) => Bin[];
}

const BinContext = createContext<BinContextProps | undefined>(undefined);

export const BinProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchBins = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await apiInstance.get('/bins');
      setBins(response.data);
    } catch (error: any) {
      console.error('Error fetching bins:', error);
      setError('Failed to fetch bins');
    } finally {
      setLoading(false);
    }
  };

  const addBin = async (binData: Omit<Bin, 'id' | 'createdAt' | 'updatedAt' | 'volumeCapacity'>) => {
    if (!user) return;
    setLoading(true);
    try {
      const volumeCapacity = binData.length * binData.width * binData.height;
      const response = await apiInstance.post('/bins', {
        ...binData,
        volumeCapacity,
      });
      setBins([...bins, response.data]);
    } catch (error: any) {
      console.error('Error adding bin:', error);
      setError('Failed to add bin');
    } finally {
      setLoading(false);
    }
  };

  const updateBin = async (id: string, binData: Partial<Bin>) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await apiInstance.put(`/bins/${id}`, binData);
      setBins(bins.map(bin => bin.id === id ? response.data : bin));
    } catch (error: any) {
      console.error('Error updating bin:', error);
      setError('Failed to update bin');
    } finally {
      setLoading(false);
    }
  };

  const deleteBin = async (id: string) => {
    if (!user) return;
    try {
      await apiInstance.delete(`/bins/${id}`);
      setBins(bins.filter(bin => bin.id !== id));
    } catch (error: any) {
      console.error('Error deleting bin:', error);
      setError('Failed to delete bin');
    }
  };

  const getBinsByUnitMatrix = (unitMatrixId: string) => {
    return bins.filter(bin => bin.unitMatrixId === unitMatrixId);
  };

  const value: BinContextProps = {
    bins,
    loading,
    error,
    fetchBins,
    addBin,
    updateBin,
    deleteBin,
    getBinsByUnitMatrix,
  };

  return (
    <BinContext.Provider value={value}>
      {children}
    </BinContext.Provider>
  );
};

export const useBins = (): BinContextProps => {
  const context = useContext(BinContext);
  if (!context) {
    throw new Error('useBins must be used within a BinProvider');
  }
  return context;
};
