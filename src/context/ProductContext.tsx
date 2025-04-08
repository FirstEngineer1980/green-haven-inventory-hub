
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Product, StockMovement } from '../types';
import { mockProducts, mockStockMovements } from '../data/mockData';
import { useNotifications } from './NotificationContext';

interface ProductContextType {
  products: Product[];
  stockMovements: StockMovement[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'date'>) => void;
  getLowStockProducts: () => Product[];
}

const ProductContext = createContext<ProductContextType>({} as ProductContextType);

export const useProducts = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(mockStockMovements);
  const { addNotification } = useNotifications();

  // Check for low stock products on initial load
  useEffect(() => {
    const lowStockProducts = getLowStockProducts();
    if (lowStockProducts.length > 0) {
      // No need to send notifications here as they're already in mock data
      // In a real app, you might want to check and send notifications
    }
  }, []);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    };
    
    setProducts(prev => [...prev, newProduct]);
    
    // Send notification about new product
    addNotification({
      title: 'New Product Added',
      message: `${newProduct.name} has been added to inventory`,
      type: 'info',
      for: ['1', '2', '3', '4'], // All users in this demo
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id 
          ? { ...product, ...updates, updatedAt: new Date().toISOString() } 
          : product
      )
    );
    
    // Get the updated product
    const updatedProduct = products.find(p => p.id === id);
    if (updatedProduct) {
      // Send notification about update
      addNotification({
        title: 'Inventory Updated',
        message: `${updatedProduct.name} inventory has been updated`,
        type: 'success',
        for: ['1', '2', '3'], // Admin, Manager, Staff
      });
      
      // Check if product is now below threshold
      if ((updates.quantity !== undefined) && 
          (updates.quantity <= (updates.threshold || updatedProduct.threshold))) {
        addNotification({
          title: 'Low Stock Alert',
          message: `${updatedProduct.name} is below the threshold quantity`,
          type: 'warning',
          for: ['1', '2'], // Admin, Manager
        });
      }
    }
  };

  const deleteProduct = (id: string) => {
    // Get the product before deleting
    const productToDelete = products.find(p => p.id === id);
    
    setProducts(prev => prev.filter(product => product.id !== id));
    
    if (productToDelete) {
      addNotification({
        title: 'Product Deleted',
        message: `${productToDelete.name} has been removed from inventory`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

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
      addProduct, 
      updateProduct, 
      deleteProduct,
      addStockMovement,
      getLowStockProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};
