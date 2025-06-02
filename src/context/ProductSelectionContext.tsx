
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

export interface ProductForSelection {
  id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  costPrice?: number;
  image?: string;
}

interface ProductSelectionContextType {
  products: ProductForSelection[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getProductBySku: (sku: string) => Promise<ProductForSelection | null>;
}

const ProductSelectionContext = createContext<ProductSelectionContextType>({} as ProductSelectionContextType);

export const useProductSelection = () => useContext(ProductSelectionContext);

export const ProductSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ProductForSelection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const transformProduct = (backendProduct: any): ProductForSelection => {
    return {
      id: backendProduct.id?.toString() || '',
      name: backendProduct.name || '',
      sku: backendProduct.sku || '',
      description: backendProduct.description || '',
      price: parseFloat(backendProduct.price) || 0,
      costPrice: parseFloat(backendProduct.cost_price) || 0,
      image: backendProduct.image || '',
    };
  };

  const fetchProducts = async () => {
    if (!user || loading) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.get('/customer-products/products');
      const transformedProducts = response.data.map(transformProduct);
      setProducts(transformedProducts);
    } catch (err: any) {
      console.error('Error fetching products for selection:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const getProductBySku = async (sku: string): Promise<ProductForSelection | null> => {
    if (!user) return null;
    
    try {
      const response = await apiInstance.get(`/customer-products/product-by-sku/${sku}`);
      return transformProduct(response.data);
    } catch (err: any) {
      console.error('Error fetching product by SKU:', err);
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  return (
    <ProductSelectionContext.Provider value={{ 
      products, 
      loading,
      error,
      fetchProducts,
      getProductBySku
    }}>
      {children}
    </ProductSelectionContext.Provider>
  );
};
