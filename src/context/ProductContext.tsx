import React, { createContext, useState, useContext, useEffect } from 'react';
import { Product, StockMovement, Category } from '../types';
import { useNotifications } from './NotificationContext';
import api from '../services/api';

interface ProductContextType {
  products: Product[];
  stockMovements: StockMovement[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'date'>) => void;
  getLowStockProducts: () => Product[];
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({} as ProductContextType);

export const useProducts = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const { addNotification } = useNotifications();

  // Fetch products and categories on initial mount using backend API
  useEffect(() => {
    api.products.getAll().then(res => setProducts(res.data)).catch(() => {});
    api.categories.getAll?.()
      .then(res => setCategories(res.data))
      .catch(() => {});
    // Note: handle stockMovements as needed.
  }, []);

  // Product CRUD
  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await api.products.create(product);
    setProducts((prev) => [...prev, res.data]);
    addNotification({
      title: 'New Product Added',
      message: `${res.data.name} has been added to inventory`,
      type: 'info',
      for: ['1', '2', '3', '4'],
    });
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const res = await api.products.update(id, updates);
    setProducts(prev => 
      prev.map(product => 
        product.id == id 
          ? { ...product, ...res.data }
          : product
      )
    );
    addNotification({
      title: 'Inventory Updated',
      message: `${res.data.name} inventory has been updated`,
      type: 'success',
      for: ['1', '2', '3'],
    });
    if ((res.data.quantity !== undefined) && (res.data.quantity <= (res.data.threshold))) {
      addNotification({
        title: 'Low Stock Alert',
        message: `${res.data.name} is below the threshold quantity`,
        type: 'warning',
        for: ['1', '2'],
      });
    }
  };

  const deleteProduct = async (id: string) => {
    const prod = products.find(p => p.id == id);
    await api.products.delete(id);
    setProducts(prev => prev.filter(product => product.id != id));
    if (prod) {
      addNotification({
        title: 'Product Deleted',
        message: `${prod.name} has been removed from inventory`,
        type: 'info',
        for: ['1', '2'],
      });
    }
  };

  // Category CRUD
  const addCategory = async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await api.categories.create(category);
    setCategories(prev => [...prev, res.data]);
    addNotification({
      title: 'New Category Added',
      message: `${res.data.name} category has been added`,
      type: 'info',
      for: ['1', '2'],
    });
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const res = await api.categories.update(id, updates);
    setCategories(prev => 
      prev.map(category => 
        category.id == id 
          ? { ...category, ...res.data }
          : category
      )
    );
    addNotification({
      title: 'Category Updated',
      message: `${res.data.name} category has been updated`,
      type: 'info',
      for: ['1', '2'],
    });
  };

  const deleteCategory = async (id: string) => {
    const cat = categories.find(c => c.id == id);
    await api.categories.delete(id);
    setCategories(prev => prev.filter(category => category.id != id));
    if (cat) {
      addNotification({
        title: 'Category Deleted',
        message: `${cat.name} category has been removed`,
        type: 'info',
        for: ['1', '2'],
      });
    }
  };

  // You might need to review addStockMovement and getLowStockProducts logic for API support.
  const addStockMovement = (movement: Omit<StockMovement, 'id' | 'date'>) => {
    const newMovement: StockMovement = {
      ...movement,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    setStockMovements(prev => [newMovement, ...prev]);
    
    // Update product quantity
    const product = products.find(p => p.id === movement.productId);
    if (product) {
      const newQuantity = movement.type === 'in' 
        ? product.quantity + movement.quantity
        : product.quantity - movement.quantity;
        
      updateProduct(movement.productId, { quantity: newQuantity });
    }
  };

  const getLowStockProducts = (): Product[] => {
    return products.filter(product => product.quantity <= product.threshold);
  };

  return (
    <ProductContext.Provider value={{
      products,
      stockMovements,
      categories,
      addProduct,
      updateProduct,
      deleteProduct,
      addStockMovement,
      getLowStockProducts,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </ProductContext.Provider>
  );
};
