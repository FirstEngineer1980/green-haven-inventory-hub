
import React, { createContext, useState, useContext } from 'react';
import { Bin } from '../types';
import { useNotifications } from './NotificationContext';
import { useUnitMatrix } from './UnitMatrixContext';

// Mock bin data
const mockBins: Bin[] = [
  {
    id: '1',
    name: 'Bin-A1',
    length: 30,
    width: 20,
    height: 15,
    volumeCapacity: 9000, // length * width * height
    unitMatrixId: '1',
    unitMatrixName: 'UnitA',
    createdAt: '2023-05-15T09:30:00Z',
    updatedAt: '2023-08-25T11:45:00Z'
  },
  {
    id: '2',
    name: 'Bin-B2',
    length: 40,
    width: 25,
    height: 20,
    volumeCapacity: 20000, // length * width * height
    unitMatrixId: '1',
    unitMatrixName: 'UnitA',
    createdAt: '2023-06-20T14:15:00Z',
    updatedAt: '2023-09-05T16:20:00Z'
  },
  {
    id: '3',
    name: 'Bin-C3',
    length: 25,
    width: 15,
    height: 10,
    volumeCapacity: 3750, // length * width * height
    createdAt: '2023-07-18T10:40:00Z',
    updatedAt: '2023-10-02T13:30:00Z'
  }
];

interface BinContextType {
  bins: Bin[];
  addBin: (bin: Omit<Bin, 'id' | 'volumeCapacity' | 'unitMatrixName' | 'createdAt' | 'updatedAt'>) => void;
  updateBin: (id: string, updates: Partial<Bin>) => void;
  deleteBin: (id: string) => void;
  getBinsByUnitMatrix: (unitMatrixId: string) => Bin[];
}

const BinContext = createContext<BinContextType>({} as BinContextType);

export const useBins = () => useContext(BinContext);

export const BinProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bins, setBins] = useState<Bin[]>(mockBins);
  const { addNotification } = useNotifications();
  const { unitMatrices } = useUnitMatrix();

  const getUnitMatrixName = (unitMatrixId: string): string | undefined => {
    const unitMatrix = unitMatrices.find(um => um.id === unitMatrixId);
    return unitMatrix ? unitMatrix.name : undefined;
  };

  const calculateVolumeCapacity = (length: number, width: number, height: number): number => {
    return length * width * height;
  };

  const addBin = (bin: Omit<Bin, 'id' | 'volumeCapacity' | 'unitMatrixName' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const volumeCapacity = calculateVolumeCapacity(bin.length, bin.width, bin.height);
    const unitMatrixName = bin.unitMatrixId ? getUnitMatrixName(bin.unitMatrixId) : undefined;
    
    const newBin: Bin = {
      ...bin,
      id: Date.now().toString(),
      volumeCapacity,
      unitMatrixName,
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
    setBins(prev => 
      prev.map(bin => {
        if (bin.id === id) {
          // Recalculate volume capacity if any dimension is updated
          const length = updates.length ?? bin.length;
          const width = updates.width ?? bin.width;
          const height = updates.height ?? bin.height;
          const volumeCapacity = calculateVolumeCapacity(length, width, height);
          
          // Get unit matrix name if unitMatrixId is updated
          const unitMatrixId = updates.unitMatrixId ?? bin.unitMatrixId;
          const unitMatrixName = unitMatrixId ? getUnitMatrixName(unitMatrixId) : undefined;
          
          return { 
            ...bin, 
            ...updates, 
            volumeCapacity,
            unitMatrixName,
            updatedAt: new Date().toISOString() 
          };
        }
        return bin;
      })
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
    // Get the bin before deleting
    const binToDelete = bins.find(b => b.id === id);
    
    setBins(prev => prev.filter(bin => bin.id !== id));
    
    if (binToDelete) {
      addNotification({
        title: 'Bin Deleted',
        message: `Bin "${binToDelete.name}" has been deleted`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

  const getBinsByUnitMatrix = (unitMatrixId: string): Bin[] => {
    return bins.filter(bin => bin.unitMatrixId === unitMatrixId);
  };

  return (
    <BinContext.Provider value={{ 
      bins, 
      addBin, 
      updateBin, 
      deleteBin,
      getBinsByUnitMatrix
    }}>
      {children}
    </BinContext.Provider>
  );
};
