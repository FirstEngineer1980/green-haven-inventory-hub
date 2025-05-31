import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category } from '../types';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

interface CategoryContextProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextProps | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCategories = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching categories from API...');
      const response = await apiInstance.get('/categories');
      console.log('Categories response:', response.data);
      
      // Transform backend data to frontend format
      const transformedCategories = response.data.map((cat: any) => ({
        id: cat.id.toString(),
        name: cat.name,
        description: cat.description || '',
        productCount: cat.products_count || 0,
      }));
      
      setCategories(transformedCategories);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch categories';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log('Adding category:', category);
      const backendData = {
        name: category.name,
        description: category.description || '',
      };
      
      const response = await apiInstance.post('/categories', backendData);
      console.log('Add category response:', response.data);
      
      const newCategory: Category = {
        id: response.data.id.toString(),
        name: response.data.name,
        description: response.data.description || '',
        productCount: 0,
      };
      
      setCategories(prev => [...prev, newCategory]);
    } catch (error: any) {
      console.error('Error adding category:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add category';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log('Updating category:', id, category);
      const backendData: any = {};
      if (category.name !== undefined) backendData.name = category.name;
      if (category.description !== undefined) backendData.description = category.description;
      
      const response = await apiInstance.put(`/categories/${id}`, backendData);
      console.log('Update category response:', response.data);
      
      const updatedCategory: Category = {
        id: response.data.id.toString(),
        name: response.data.name,
        description: response.data.description || '',
        productCount: response.data.products_count || 0,
      };
      
      setCategories(prev =>
        prev.map(cat => cat.id === id ? updatedCategory : cat)
      );
    } catch (error: any) {
      console.error('Error updating category:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update category';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log('Deleting category:', id);
      await apiInstance.delete(`/categories/${id}`);
      console.log('Category deleted successfully');
      
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (error: any) {
      console.error('Error deleting category:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete category';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value: CategoryContextProps = {
    categories,
    loading,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = (): CategoryContextProps => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
