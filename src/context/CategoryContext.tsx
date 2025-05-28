
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category } from '../types';
import { useAuth } from './AuthContext';
import { apiInstance } from '../services/api';

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
    try {
      const response = await apiInstance.get('/categories');
      setCategories(response.data);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await apiInstance.post('/categories', category);
      setCategories([...categories, response.data]);
    } catch (error: any) {
      console.error('Error adding category:', error);
      setError('Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await apiInstance.put(`/categories/${id}`, category);
      setCategories(
        categories.map((cat) => (cat.id === id ? response.data : cat))
      );
    } catch (error: any) {
      console.error('Error updating category:', error);
      setError('Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;
    setLoading(true);
    try {
      await apiInstance.delete(`/categories/${id}`);
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (error: any) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');
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
