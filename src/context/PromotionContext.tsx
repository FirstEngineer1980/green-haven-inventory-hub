import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Promotion } from '../types';
import { useAuth } from './AuthContext';
import { apiServices } from '@/services/api';

interface PromotionContextProps {
  promotions: Promotion[];
  loading: boolean;
  error: string | null;
  fetchPromotions: () => Promise<void>;
  addPromotion: (promotion: Omit<Promotion, 'id'>) => Promise<void>;
  updatePromotion: (id: string, promotion: Partial<Promotion>) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;
}

const PromotionContext = createContext<PromotionContextProps | undefined>(undefined);

export const PromotionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPromotions = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await apiServices.promotions.getPromotions();
      setPromotions(data);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError('Failed to fetch promotions');
    } finally {
      setLoading(false);
    }
  };

  const addPromotion = async (promotion: Omit<Promotion, 'id'>) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const newPromotion = await apiServices.promotions.addPromotion(promotion);
      setPromotions(prev => [...prev, newPromotion]);
    } catch (err) {
      console.error('Error adding promotion:', err);
      setError('Failed to add promotion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePromotion = async (id: string, promotion: Partial<Promotion>) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const updatedPromotion = await apiServices.promotions.updatePromotion(id, promotion);
      setPromotions(prev => 
        prev.map(p => p.id === id ? updatedPromotion : p)
      );
    } catch (err) {
      console.error('Error updating promotion:', err);
      setError('Failed to update promotion');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePromotion = async (id: string) => {
    if (!user) return;
    
    try {
      await apiServices.promotions.deletePromotion(id);
      setPromotions(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting promotion:', err);
      setError('Failed to delete promotion');
      throw err;
    }
  };

  const value: PromotionContextProps = {
    promotions,
    loading,
    error,
    fetchPromotions,
    addPromotion,
    updatePromotion,
    deletePromotion,
  };

  return (
    <PromotionContext.Provider value={value}>
      {children}
    </PromotionContext.Provider>
  );
};

export const usePromotions = (): PromotionContextProps => {
  const context = useContext(PromotionContext);
  if (!context) {
    throw new Error('usePromotions must be used within a PromotionProvider');
  }
  return context;
};
