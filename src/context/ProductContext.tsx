import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

interface ProductContextProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextProps | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProducts = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      console.log('Fetching products from API...');
      const response = await apiInstance.get('/products');
      console.log('Products response:', response.data);
      setProducts(response.data);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch products';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      console.log('Adding product with frontend data:', product);
      
      // Map frontend field names to backend field names
      const backendData = {
        name: product.name,
        sku: product.sku,
        description: product.description || '',
        category_id: null, // Will need to be mapped properly if categories are used
        price: product.price,
        cost_price: product.costPrice, // Map costPrice to cost_price
        quantity: product.quantity,
        threshold: product.threshold,
        location: product.location || '',
        image: product.image || '',
        status: 'active',
        barcode: '',
        weight: '',
        dimensions: '',
      };

      console.log('Sending to backend:', backendData);
      const response = await apiInstance.post('/products', backendData);
      console.log('Add product response:', response.data);
      
      // Transform response back to frontend format
      const newProduct: Product = {
        id: response.data.id,
        name: response.data.name,
        sku: response.data.sku,
        description: response.data.description || '',
        category: response.data.category?.name || '',
        price: parseFloat(response.data.price),
        costPrice: parseFloat(response.data.cost_price),
        quantity: response.data.quantity,
        threshold: response.data.threshold,
        location: response.data.location || '',
        image: response.data.image || '',
        createdAt: response.data.created_at || new Date().toISOString(),
        updatedAt: response.data.updated_at || new Date().toISOString(),
      };

      setProducts(prev => [...prev, newProduct]);
    } catch (err: any) {
      console.error('Error adding product:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add product';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.put(`/products/${id}`, product);
      setProducts(prev =>
        prev.map(p => p.id === id ? response.data : p)
      );
    } catch (err: any) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      await apiInstance.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setError(err.message || 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value: ProductContextProps = {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextProps => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
