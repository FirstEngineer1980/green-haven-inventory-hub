
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

export interface CustomerProduct {
  customer_id: string;
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

interface CustomerProductContextType {
  customerProducts: CustomerProduct[];
  loading: boolean;
  error: string | null;
  addCustomerProduct: (product: Omit<CustomerProduct, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCustomerProduct: (id: string, updates: Partial<CustomerProduct>) => Promise<void>;
  deleteCustomerProduct: (id: string) => Promise<void>;
  getCustomerProducts: (customer_id?: string) => CustomerProduct[];
  fetchCustomerProducts: () => Promise<void>;
}

const CustomerProductContext = createContext<CustomerProductContextType>({} as CustomerProductContextType);

export const useCustomerProducts = () => useContext(CustomerProductContext);

export const CustomerProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customerProducts, setCustomerProducts] = useState<CustomerProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const fetchCustomerProducts = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.get('/customer-products');
      setCustomerProducts(response.data);
    } catch (err: any) {
      console.error('Error fetching customer products:', err);
      setError('Failed to fetch customer products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCustomerProducts();
    }
  }, [user]);

  const addCustomerProduct = async (product: Omit<CustomerProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.post('/customer-products', product);
      setCustomerProducts(prev => [...prev, response.data]);
      
      addNotification({
        title: 'New Customer Product Added',
        message: `${response.data.name} has been added to customer's products`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    } catch (err: any) {
      console.error('Error adding customer product:', err);
      setError('Failed to add customer product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomerProduct = async (id: string, updates: Partial<CustomerProduct>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.put(`/customer-products/${id}`, updates);
      setCustomerProducts(prev => 
        prev.map(product => 
          product.id === id ? response.data : product
        )
      );
      
      addNotification({
        title: 'Customer Product Updated',
        message: `${response.data.name} has been updated`,
        type: 'success',
        for: ['1', '2'], // Admin, Manager
      });
    } catch (err: any) {
      console.error('Error updating customer product:', err);
      setError('Failed to update customer product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomerProduct = async (id: string) => {
    if (!user) return;
    
    const productToDelete = customerProducts.find(p => p.id === id);
    
    try {
      await apiInstance.delete(`/customer-products/${id}`);
      setCustomerProducts(prev => prev.filter(product => product.id !== id));
      
      if (productToDelete) {
        addNotification({
          title: 'Customer Product Deleted',
          message: `${productToDelete.name} has been removed from customer's products`,
          type: 'info',
          for: ['1', '2'], // Admin, Manager
        });
      }
    } catch (err: any) {
      console.error('Error deleting customer product:', err);
      setError('Failed to delete customer product');
      throw err;
    }
  };

  const getCustomerProducts = (customer_id?: string): CustomerProduct[] => {
    if (customer_id) {
      return customerProducts.filter(product => product.customer_id === customer_id);
    }
    return customerProducts;
  };

  return (
    <CustomerProductContext.Provider value={{ 
      customerProducts, 
      loading,
      error,
      addCustomerProduct, 
      updateCustomerProduct, 
      deleteCustomerProduct,
      getCustomerProducts,
      fetchCustomerProducts
    }}>
      {children}
    </CustomerProductContext.Provider>
  );
};
