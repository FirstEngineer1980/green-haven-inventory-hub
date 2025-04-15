
import React, { createContext, useState, useContext } from 'react';
import { Bin } from '@/types';
import { useNotifications } from './NotificationContext';

const initialBins: Bin[] = [
  {
    id: '1',
    name: 'Bin A1',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Bin B2',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

interface BinContextType {
  bins: Bin[];
  addBin: (bin: Omit<Bin, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBin: (id: string, updates: Partial<Bin>) => void;
  deleteBin: (id: string) => void;
  getBinById: (id: string) => Bin | undefined;
  getBinsByUnitMatrix: (unitMatrixId: string) => Bin[];
}

const BinContext = createContext<BinContextType>({
  bins: [],
  addBin: () => {},
  updateBin: () => {},
  deleteBin: () => {},
  getBinById: () => undefined,
  getBinsByUnitMatrix: () => []
});

export const useBins = () => useContext(BinContext);

export const BinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bins, setBins] = useState<Bin[]>(initialBins);
  const { addNotification } = useNotifications();

  const addBin = (bin: Omit<Bin, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!bin || !bin.name) {
      console.error('Invalid bin data');
      return;
    }

    const now = new Date().toISOString();
    
    const newBin: Bin = {
      ...bin,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    };
    
    setBins(prev => [...prev, newBin]);
    
    // Send notification about new bin
    addNotification({
      title: 'New Bin Added',
      message: `Bin "${newBin.name}" has been added`,
      type: 'info',
      for: ['1', '2'], // Admin, Manager
    });
  };

  const updateBin = (id: string, updates: Partial<Bin>) => {
    if (!id) return;

    setBins(prev => 
      prev.map(bin => 
        bin.id === id 
          ? { 
              ...bin, 
              ...updates,
              updatedAt: new Date().toISOString() 
            } 
          : bin
      )
    );
    
    // Get the updated bin
    const updatedBin = bins.find(b => b.id === id);
    if (updatedBin) {
      // Send notification about update
      addNotification({
        title: 'Bin Updated',
        message: `Bin "${updatedBin.name}" has been updated`,
        type: 'success',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

  const deleteBin = (id: string) => {
    if (!id) return;

    // Get the bin before deleting
    const binToDelete = bins.find(b => b.id === id);
    
    setBins(prev => prev.filter(bin => bin.id !== id));
    
    if (binToDelete) {
      addNotification({
        title: 'Bin Deleted',
        message: `Bin "${binToDelete.name}" has been removed`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

  const getBinById = (id: string): Bin | undefined => {
    if (!id) return undefined;
    return bins.find(bin => bin.id === id);
  };
  
  // Add the missing function to get bins by unit matrix ID
  const getBinsByUnitMatrix = (unitMatrixId: string): Bin[] => {
    if (!unitMatrixId) return [];
    // For now, just returning all bins since we don't have a unitMatrixId property in bins
    // In a real implementation, you'd filter by unitMatrixId
    return bins;
  };

  return (
    <BinContext.Provider value={{ 
      bins, 
      addBin, 
      updateBin, 
      deleteBin,
      getBinById,
      getBinsByUnitMatrix
    }}>
      {children}
    </BinContext.Provider>
  );
};
