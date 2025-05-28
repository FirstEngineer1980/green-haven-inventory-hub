
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  status: string;
  commissionRate?: number;
  leaderId?: string;
  leaderName?: string;
  createdAt: string;
  updatedAt: string;
}

interface SellerContextType {
  sellers: Seller[];
  loading: boolean;
  error: string | null;
  addSeller: (seller: Omit<Seller, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSeller: (id: string, updates: Partial<Seller>) => Promise<void>;
  deleteSeller: (id: string) => Promise<void>;
  getSellerById: (id: string) => Seller | undefined;
  fetchSellers: () => Promise<void>;
}

const SellerContext = createContext<SellerContextType>({} as SellerContextType);

export const useSellers = () => useContext(SellerContext);

export const SellerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const fetchSellers = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.get('/sellers');
      setSellers(response.data);
    } catch (err: any) {
      console.error('Error fetching sellers:', err);
      setError('Failed to fetch sellers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSellers();
    }
  }, [user]);

  const getSellerById = (id: string): Seller | undefined => {
    return sellers.find(seller => seller.id === id);
  };

  const addSeller = async (seller: Omit<Seller, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.post('/sellers', seller);
      setSellers(prev => [...prev, response.data]);
      
      addNotification({
        title: 'New Seller Added',
        message: `Seller "${response.data.name}" has been added to the system`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    } catch (err: any) {
      console.error('Error adding seller:', err);
      setError('Failed to add seller');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSeller = async (id: string, updates: Partial<Seller>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.put(`/sellers/${id}`, updates);
      setSellers(prev => 
        prev.map(seller => 
          seller.id === id ? response.data : seller
        )
      );
    } catch (err: any) {
      console.error('Error updating seller:', err);
      setError('Failed to update seller');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSeller = async (id: string) => {
    if (!user) return;
    
    const sellerToDelete = sellers.find(seller => seller.id === id);
    
    try {
      await apiInstance.delete(`/sellers/${id}`);
      setSellers(prev => prev.filter(seller => seller.id !== id));
      
      if (sellerToDelete) {
        addNotification({
          title: 'Seller Deleted',
          message: `Seller "${sellerToDelete.name}" has been removed from the system`,
          type: 'info',
          for: ['1', '2'], // Admin, Manager
        });
      }
    } catch (err: any) {
      console.error('Error deleting seller:', err);
      setError('Failed to delete seller');
      throw err;
    }
  };

  return (
    <SellerContext.Provider value={{ 
      sellers, 
      loading,
      error,
      addSeller, 
      updateSeller, 
      deleteSeller,
      getSellerById,
      fetchSellers
    }}>
      {children}
    </SellerContext.Provider>
  );
};
