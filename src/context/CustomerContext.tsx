
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Customer } from '../types';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

interface CustomerContextType {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCustomer: (id: string, updates: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  getCustomerById: (id: string) => Customer | undefined;
  toggleCustomerStatus: (id: string, status: 'active' | 'paused' | 'inactive') => Promise<void>;
  fetchCustomers: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType>({} as CustomerContextType);

export const useCustomers = () => useContext(CustomerContext);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const fetchCustomers = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.get('/customers');
      setCustomers(response.data);
    } catch (err: any) {
      console.error('Error fetching customers:', err);
      setError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCustomers();
    }
  }, [user]);

  const getCustomerById = (id: string): Customer | undefined => {
    return customers.find(customer => customer.id === id);
  };

  const addCustomer = async (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.post('/customers', customer);
      setCustomers(prev => [...prev, response.data]);
      
      addNotification({
        title: 'New Customer Added',
        message: `Customer ${response.data.name} from ${response.data.company || 'N/A'} has been added`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    } catch (err: any) {
      console.error('Error adding customer:', err);
      setError('Failed to add customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.put(`/customers/${id}`, updates);
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === id ? response.data : customer
        )
      );
    } catch (err: any) {
      console.error('Error updating customer:', err);
      setError('Failed to update customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    if (!user) return;
    
    const customerToDelete = customers.find(customer => customer.id === id);
    
    try {
      await apiInstance.delete(`/customers/${id}`);
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      
      if (customerToDelete) {
        addNotification({
          title: 'Customer Deleted',
          message: `Customer ${customerToDelete.name} has been removed from the system`,
          type: 'info',
          for: ['1', '2'], // Admin, Manager
        });
      }
    } catch (err: any) {
      console.error('Error deleting customer:', err);
      setError('Failed to delete customer');
      throw err;
    }
  };

  const toggleCustomerStatus = async (id: string, newStatus: 'active' | 'paused' | 'inactive') => {
    if (!user) return;
    
    try {
      const response = await apiInstance.put(`/customers/${id}`, { status: newStatus });
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === id ? response.data : customer
        )
      );
    } catch (err: any) {
      console.error('Error updating customer status:', err);
      setError('Failed to update customer status');
      throw err;
    }
  };

  return (
    <CustomerContext.Provider value={{ 
      customers, 
      loading,
      error,
      addCustomer, 
      updateCustomer, 
      deleteCustomer,
      getCustomerById,
      toggleCustomerStatus,
      fetchCustomers
    }}>
      {children}
    </CustomerContext.Provider>
  );
};
