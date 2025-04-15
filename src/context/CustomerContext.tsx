
import React, { createContext, useState, useContext } from 'react';
import { Customer } from '../types';
import { useNotifications } from './NotificationContext';

// Mock customer data
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-1234',
    address: '123 Main St, Anytown',
    company: 'ABC Corporation',
    totalOrders: 15,
    createdAt: '2023-03-10T10:30:00Z',
    updatedAt: '2023-06-15T14:45:00Z'
  },
  {
    id: '2',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    phone: '555-5678',
    address: '456 Oak Ave, Somewhere',
    company: 'XYZ Solutions',
    totalOrders: 8,
    createdAt: '2023-04-05T09:15:00Z',
    updatedAt: '2023-07-20T11:30:00Z'
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '555-9012',
    address: '789 Pine Blvd, Nowhere',
    company: 'Tech Innovators',
    totalOrders: 22,
    createdAt: '2023-02-15T15:20:00Z',
    updatedAt: '2023-08-10T16:40:00Z'
  }
];

interface CustomerContextType {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;
}

const CustomerContext = createContext<CustomerContextType>({} as CustomerContextType);

export const useCustomers = () => useContext(CustomerContext);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const { addNotification } = useNotifications();

  const getCustomerById = (id: string): Customer | undefined => {
    return customers.find(customer => customer.id === id);
  };

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      totalOrders: 0
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    
    // Send notification about new customer
    addNotification({
      title: 'New Customer Added',
      message: `Customer ${newCustomer.name} from ${newCustomer.company || 'N/A'} has been added`,
      type: 'info',
      for: ['1', '2'], // Admin, Manager
    });
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === id 
          ? { ...customer, ...updates, updatedAt: new Date().toISOString() } 
          : customer
      )
    );
  };

  const deleteCustomer = (id: string) => {
    const customerToDelete = customers.find(customer => customer.id === id);
    
    if (customerToDelete) {
      setCustomers(prev => prev.filter(customer => customer.id !== id));
      
      // Send notification about customer deletion
      addNotification({
        title: 'Customer Deleted',
        message: `Customer ${customerToDelete.name} has been removed from the system`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

  return (
    <CustomerContext.Provider value={{ 
      customers, 
      addCustomer, 
      updateCustomer, 
      deleteCustomer,
      getCustomerById
    }}>
      {children}
    </CustomerContext.Provider>
  );
};
