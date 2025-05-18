
import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  start_date: string;
  end_date: string;
  image: string;
  categories: string[];
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface PromotionContextProps {
  promotions: Promotion[];
  loading: boolean;
  error: string | null;
  addPromotion: (promotion: Omit<Promotion, 'id'>) => Promise<void>;
  updatePromotion: (id: string, promotion: Partial<Promotion>) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;
  refreshPromotions: () => Promise<void>;
}

const PromotionContext = createContext<PromotionContextProps>({
  promotions: [],
  loading: false,
  error: null,
  addPromotion: async () => {},
  updatePromotion: async () => {},
  deletePromotion: async () => {},
  refreshPromotions: async () => {},
});

export const usePromotions = () => useContext(PromotionContext);

export const PromotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPromotions();
      setPromotions(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching promotions:', err);
      setError('Failed to fetch promotions');
      toast({
        title: 'Error',
        description: 'Failed to load promotions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const addPromotion = async (promotion: Omit<Promotion, 'id'>) => {
    try {
      const response = await apiService.addPromotion(promotion);
      setPromotions([...promotions, response.data]);
      toast({
        title: 'Success',
        description: 'Promotion added successfully',
      });
    } catch (err) {
      console.error('Error adding promotion:', err);
      toast({
        title: 'Error',
        description: 'Failed to add promotion',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updatePromotion = async (id: string, promotionData: Partial<Promotion>) => {
    try {
      const response = await apiService.updatePromotion(id, promotionData);
      setPromotions(
        promotions.map((promotion) => (promotion.id === id ? { ...promotion, ...response.data } : promotion))
      );
      toast({
        title: 'Success',
        description: 'Promotion updated successfully',
      });
    } catch (err) {
      console.error('Error updating promotion:', err);
      toast({
        title: 'Error',
        description: 'Failed to update promotion',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deletePromotion = async (id: string) => {
    try {
      await apiService.deletePromotion(id);
      setPromotions(promotions.filter((promotion) => promotion.id !== id));
      toast({
        title: 'Success',
        description: 'Promotion deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting promotion:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete promotion',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const contextValue: PromotionContextProps = {
    promotions,
    loading,
    error,
    addPromotion,
    updatePromotion,
    deletePromotion,
    refreshPromotions: fetchPromotions,
  };

  return <PromotionContext.Provider value={contextValue}>{children}</PromotionContext.Provider>;
};
