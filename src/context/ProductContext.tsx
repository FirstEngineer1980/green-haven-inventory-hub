import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types';
import { useAuth } from './AuthContext';
import api from '../services/api';

interface ProductContextProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
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
      const response = await api.productService.getProducts();
      setProducts(response);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const newProduct = await api.productService.addProduct(product);
      setProducts(prev => [...prev, newProduct]);
    } catch (err: any) {
      console.error('Error adding product:', err);
      setError(err.message || 'Failed to add product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const updatedProduct = await api.productService.updateProduct(id, product);
      setProducts(prev =>
        prev.map(p => p.id === id ? updatedProduct : p)
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
      await api.productService.deleteProduct(id);
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
