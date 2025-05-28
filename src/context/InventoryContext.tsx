
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

export interface InventoryItem {
  id: string;
  productId: string;
  productName?: string;
  unitId?: string;
  unitNumber?: string;
  binId?: string;
  binName?: string;
  quantity: number;
  skuMatrixId?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface InventoryContextType {
  inventoryItems: InventoryItem[];
  loading: boolean;
  error: string | null;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  getInventoryItemById: (id: string) => InventoryItem | undefined;
  getInventoryItemsByProductId: (productId: string) => InventoryItem[];
  fetchInventoryItems: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType>({} as InventoryContextType);

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const fetchInventoryItems = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.get('/inventory-items');
      setInventoryItems(response.data);
    } catch (err: any) {
      console.error('Error fetching inventory items:', err);
      setError('Failed to fetch inventory items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchInventoryItems();
    }
  }, [user]);

  const getInventoryItemById = (id: string): InventoryItem | undefined => {
    return inventoryItems.find(item => item.id === id);
  };

  const getInventoryItemsByProductId = (productId: string): InventoryItem[] => {
    return inventoryItems.filter(item => item.productId === productId);
  };

  const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.post('/inventory-items', item);
      setInventoryItems(prev => [...prev, response.data]);
      
      addNotification({
        title: 'Inventory Item Added',
        message: 'New inventory item has been added to the system',
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    } catch (err: any) {
      console.error('Error adding inventory item:', err);
      setError('Failed to add inventory item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.put(`/inventory-items/${id}`, updates);
      setInventoryItems(prev => 
        prev.map(item => 
          item.id === id ? response.data : item
        )
      );
    } catch (err: any) {
      console.error('Error updating inventory item:', err);
      setError('Failed to update inventory item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteInventoryItem = async (id: string) => {
    if (!user) return;
    
    try {
      await apiInstance.delete(`/inventory-items/${id}`);
      setInventoryItems(prev => prev.filter(item => item.id !== id));
      
      addNotification({
        title: 'Inventory Item Deleted',
        message: 'Inventory item has been removed from the system',
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    } catch (err: any) {
      console.error('Error deleting inventory item:', err);
      setError('Failed to delete inventory item');
      throw err;
    }
  };

  return (
    <InventoryContext.Provider value={{ 
      inventoryItems, 
      loading,
      error,
      addInventoryItem, 
      updateInventoryItem, 
      deleteInventoryItem,
      getInventoryItemById,
      getInventoryItemsByProductId,
      fetchInventoryItems
    }}>
      {children}
    </InventoryContext.Provider>
  );
};
