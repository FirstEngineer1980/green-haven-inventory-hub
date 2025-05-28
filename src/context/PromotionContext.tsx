import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiServices } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext'; // Import useAuth to check permissions

// Define the Promotion interface
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

// Define the context props interface
interface PromotionContextProps {
  promotions: Promotion[];
  loading: boolean;
  error: string | null;
  addPromotion: (promotion: Omit<Promotion, 'id'>) => Promise<void>;
  updatePromotion: (id: string, promotion: Partial<Promotion>) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;
  refreshPromotions: () => Promise<void>;
}

// Create the context with default values
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
  const { hasPermission } = useAuth(); // Use the hasPermission function from AuthContext

  // Fetch promotions from the API
  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const response = await apiServices.getPromotions();
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

  // Load promotions on component mount
  useEffect(() => {
    fetchPromotions();
  }, []);

  // Add a new promotion with permission check
  const addPromotion = async (promotion: Omit<Promotion, 'id'>) => {
    // Check if the user has permission to create a promotion
    if (!hasPermission('create:promotion')) {
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to add promotions',
        variant: 'destructive',
      });
      throw new Error('Permission denied');
    }

    try {
      const response = await apiServices.addPromotion(promotion);
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

  // Update an existing promotion with permission check
  const updatePromotion = async (id: string, promotionData: Partial<Promotion>) => {
    // Check if the user has permission to update a promotion
    if (!hasPermission('update:promotion')) {
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to update promotions',
        variant: 'destructive',
      });
      throw new Error('Permission denied');
    }

    try {
      const response = await apiServices.updatePromotion(id, promotionData);
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

  // Delete a promotion with permission check
  const deletePromotion = async (id: string) => {
    // Check if the user has permission to delete a promotion
    if (!hasPermission('delete:promotion')) {
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to delete promotions',
        variant: 'destructive',
      });
      throw new Error('Permission denied');
    }

    try {
      await apiServices.deletePromotion(id);
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

  // Context value to be provided
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