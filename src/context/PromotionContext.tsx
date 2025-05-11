
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Promotion, Product } from '@/types';
import { promotionAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface PromotionContextType {
  promotions: Promotion[];
  activePromotions: Promotion[];
  discountedProducts: Product[];
  loading: boolean;
  error: string | null;
  fetchPromotions: () => Promise<void>;
  getPromotionById: (id: string) => Promotion | undefined;
}

const PromotionContext = createContext<PromotionContextType>({} as PromotionContextType);

export const usePromotions = () => useContext(PromotionContext);

export const PromotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [activePromotions, setActivePromotions] = useState<Promotion[]>([]);
  const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPromotions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get all promotions
      const promotionsResponse = await promotionAPI.getAll();
      setPromotions(promotionsResponse.data);
      
      // Get active promotions
      const activePromotionsResponse = await promotionAPI.getActive();
      setActivePromotions(activePromotionsResponse.data);
      
      // Get discounted products
      const discountedProductsResponse = await promotionAPI.getDiscountedProducts();
      setDiscountedProducts(discountedProductsResponse.data);
      
    } catch (error) {
      console.error('Error fetching promotion data:', error);
      setError('Failed to load promotions. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load promotions data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const getPromotionById = (id: string): Promotion | undefined => {
    return promotions.find(promotion => promotion.id === id);
  };

  return (
    <PromotionContext.Provider
      value={{
        promotions,
        activePromotions,
        discountedProducts,
        loading,
        error,
        fetchPromotions,
        getPromotionById
      }}
    >
      {children}
    </PromotionContext.Provider>
  );
};

export default PromotionProvider;
