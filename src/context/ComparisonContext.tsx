
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Product } from '@/types';

interface ComparisonContextType {
  comparisonList: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  isInComparison: (productId: string) => boolean;
  clearComparison: () => void;
}

const ComparisonContext = createContext<ComparisonContextType>({} as ComparisonContextType);

export const useComparison = () => useContext(ComparisonContext);

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comparisonList, setComparisonList] = useState<Product[]>([]);
  
  // Load comparison list from localStorage on initial render
  useEffect(() => {
    const storedComparison = localStorage.getItem('comparison');
    if (storedComparison) {
      try {
        setComparisonList(JSON.parse(storedComparison));
      } catch (error) {
        console.error('Error parsing stored comparison list:', error);
        localStorage.removeItem('comparison');
      }
    }
  }, []);
  
  // Save comparison list to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('comparison', JSON.stringify(comparisonList));
  }, [comparisonList]);
  
  const addToComparison = (product: Product) => {
    if (!isInComparison(product.id)) {
      if (comparisonList.length >= 4) {
        setComparisonList(prev => [...prev.slice(1), product]);
      } else {
        setComparisonList(prev => [...prev, product]);
      }
    }
  };
  
  const removeFromComparison = (productId: string) => {
    setComparisonList(prev => prev.filter(product => product.id !== productId));
  };
  
  const isInComparison = (productId: string) => {
    return comparisonList.some(product => product.id === productId);
  };
  
  const clearComparison = () => {
    setComparisonList([]);
  };
  
  return (
    <ComparisonContext.Provider value={{
      comparisonList,
      addToComparison,
      removeFromComparison,
      isInComparison,
      clearComparison
    }}>
      {children}
    </ComparisonContext.Provider>
  );
};
