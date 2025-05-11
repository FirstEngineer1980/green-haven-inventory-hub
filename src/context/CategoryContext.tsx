
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  parent_id?: string | null;
  children?: Category[];
}

interface CategoryContextProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextProps>({
  categories: [],
  loading: false,
  error: null,
  addCategory: async () => {},
  updateCategory: async () => {},
  deleteCategory: async () => {},
  refreshCategories: async () => {},
});

export const useCategories = () => useContext(CategoryContext);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCategories();
      setCategories(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories');
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const response = await apiService.addCategory(category);
      setCategories([...categories, response.data]);
      toast({
        title: 'Success',
        description: 'Category added successfully',
      });
    } catch (err) {
      console.error('Error adding category:', err);
      toast({
        title: 'Error',
        description: 'Failed to add category',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      const response = await apiService.updateCategory(id, categoryData);
      setCategories(
        categories.map((category) => (category.id === id ? { ...category, ...response.data } : category))
      );
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
    } catch (err) {
      console.error('Error updating category:', err);
      toast({
        title: 'Error',
        description: 'Failed to update category',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await apiService.deleteCategory(id);
      setCategories(categories.filter((category) => category.id !== id));
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting category:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const contextValue: CategoryContextProps = {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: fetchCategories,
  };

  return <CategoryContext.Provider value={contextValue}>{children}</CategoryContext.Provider>;
};
