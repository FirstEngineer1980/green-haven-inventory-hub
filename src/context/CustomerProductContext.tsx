
import React, { createContext, useState, useContext } from 'react';
import { useNotifications } from './NotificationContext';

// Define the CustomerProduct type
export interface CustomerProduct {
  id: string;
  sku: string;
  qty: number;
  name: string;
  picture?: string;
  description?: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data for customer products
const mockCustomerProducts: CustomerProduct[] = [
  {
    id: '1',
    sku: 'CP001',
    qty: 5,
    name: 'Premium Storage Box',
    picture: '/lovable-uploads/d91b21ec-f9f8-4a7c-a56d-b27e4f102321.png',
    description: 'High-quality storage box for secure storage',
    customerId: '1',
    createdAt: '2023-05-10T08:30:00Z',
    updatedAt: '2023-05-10T08:30:00Z'
  },
  {
    id: '2',
    sku: 'CP002',
    qty: 3,
    name: 'Document Container',
    description: 'Fireproof container for important documents',
    customerId: '1',
    createdAt: '2023-06-15T14:20:00Z',
    updatedAt: '2023-06-15T14:20:00Z'
  },
  {
    id: '3',
    sku: 'CP003',
    qty: 10,
    name: 'Plastic Bin Large',
    picture: '/placeholder.svg',
    description: 'Large plastic bin for general storage needs',
    customerId: '2',
    createdAt: '2023-07-22T11:45:00Z',
    updatedAt: '2023-07-22T11:45:00Z'
  },
];

// Define the context type
interface CustomerProductContextType {
  customerProducts: CustomerProduct[];
  addCustomerProduct: (product: Omit<CustomerProduct, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomerProduct: (id: string, updates: Partial<CustomerProduct>) => void;
  deleteCustomerProduct: (id: string) => void;
  getCustomerProducts: (customerId?: string) => CustomerProduct[];
}

// Create the context
const CustomerProductContext = createContext<CustomerProductContextType>({} as CustomerProductContextType);

// Create a hook to use the context
export const useCustomerProducts = () => useContext(CustomerProductContext);

// Create the provider component
export const CustomerProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerProducts, setCustomerProducts] = useState<CustomerProduct[]>(mockCustomerProducts);
  const { addNotification } = useNotifications();

  // Add a new customer product
  const addCustomerProduct = (product: Omit<CustomerProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProduct: CustomerProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    };
    
    setCustomerProducts(prev => [...prev, newProduct]);
    
    // Send notification about new product
    addNotification({
      title: 'New Customer Product Added',
      message: `${newProduct.name} has been added to customer's products`,
      type: 'info',
      for: ['1', '2'], // Admin, Manager
    });
  };

  // Update an existing customer product
  const updateCustomerProduct = (id: string, updates: Partial<CustomerProduct>) => {
    setCustomerProducts(prev => 
      prev.map(product => 
        product.id === id 
          ? { ...product, ...updates, updatedAt: new Date().toISOString() } 
          : product
      )
    );
    
    // Get the updated product
    const updatedProduct = customerProducts.find(p => p.id === id);
    if (updatedProduct) {
      // Send notification about update
      addNotification({
        title: 'Customer Product Updated',
        message: `${updatedProduct.name} has been updated`,
        type: 'success',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

  // Delete a customer product
  const deleteCustomerProduct = (id: string) => {
    // Get the product before deleting
    const productToDelete = customerProducts.find(p => p.id === id);
    
    setCustomerProducts(prev => prev.filter(product => product.id !== id));
    
    if (productToDelete) {
      addNotification({
        title: 'Customer Product Deleted',
        message: `${productToDelete.name} has been removed from customer's products`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

  // Get customer products, optionally filtered by customer ID
  const getCustomerProducts = (customerId?: string): CustomerProduct[] => {
    if (customerId) {
      return customerProducts.filter(product => product.customerId === customerId);
    }
    return customerProducts;
  };

  return (
    <CustomerProductContext.Provider value={{ 
      customerProducts, 
      addCustomerProduct, 
      updateCustomerProduct, 
      deleteCustomerProduct,
      getCustomerProducts
    }}>
      {children}
    </CustomerProductContext.Provider>
  );
};
