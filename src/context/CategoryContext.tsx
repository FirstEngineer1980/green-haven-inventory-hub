import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Category } from '../types';
import { useAuth } from './AuthContext';
import { apiServices } from '@/services/api';

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
  const { user } = useAuth();

  const fetchCategories = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await apiServices.categories.getCategories();
      setCategories(data);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    if (!user) return;
    setLoading(true);
    try {
      const newCategory = await apiServices.categories.addCategory(category);
      setCategories([...categories, newCategory]);
    } catch (error: any) {
      console.error('Error adding category:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    if (!user) return;
    setLoading(true);
    try {
      await apiServices.categories.updateCategory(id, category);
      setCategories(
        categories.map((cat) => (cat.id === id ? { ...cat, ...category } : cat))
      );
    } catch (error: any) {
      console.error('Error updating category:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;
    setLoading(true);
    try {
      await apiServices.categories.deleteCategory(id);
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (error: any) {
      console.error('Error deleting category:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: CategoryContextProps = {
    categories,
    loading,
    error: null,
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
