
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
      console.log('ProductSelectionContext: Fetching products...');
      const response = await apiInstance.get('/products/for-selection');
      console.log('ProductSelectionContext: Raw response:', response.data);
      
      // Ensure response.data is a valid array
      const rawProducts = Array.isArray(response.data) ? response.data : [];
      console.log('ProductSelectionContext: Raw products array:', rawProducts);
      
      // Transform and filter valid products
      const transformedProducts = rawProducts
        .filter(product => product && typeof product === 'object')
        .map(product => {
          try {
            return transformProduct(product);
          } catch (err) {
            console.warn('ProductSelectionContext: Failed to transform product:', product, err);
            return null;
          }
        })
        .filter((product): product is ProductForSelection => product !== null && typeof product.sku === 'string' && product.sku.trim() !== '');
      
      console.log('ProductSelectionContext: Transformed products:', transformedProducts);
      setProducts(transformedProducts);
    } catch (err: any) {
      console.error('ProductSelectionContext: Error fetching products:', err);
      setError('Failed to fetch products');
      // CRITICAL: Always ensure products remains a valid array, never set to undefined
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getProductBySku = async (sku: string): Promise<ProductForSelection | null> => {
    if (!user) return null;
    
    try {
      const response = await apiInstance.get(`/products/sku/${sku}`);
      return transformProduct(response.data);
    } catch (err: any) {
      console.error('Error fetching product by SKU:', err);
      return null;
    }
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
    } else {
      // Ensure products is always an empty array when no user
      setProducts([]);
    }
  }, [user]);

  // Double-check that products is always an array before providing context
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <ProductSelectionContext.Provider value={{ 
      products: safeProducts, 
      loading,
      error,
      fetchProducts,
      getProductBySku
    }}>
      {children}
    </ProductSelectionContext.Provider>
  );
};
