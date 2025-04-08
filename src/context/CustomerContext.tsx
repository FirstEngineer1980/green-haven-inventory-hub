
import React, { createContext, useState, useContext } from 'react';
import { Customer } from '../types';
import { useNotifications } from './NotificationContext';

// Mock customer data
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown, CA 94321',
    company: 'Eco Solutions Inc',
    notes: 'Regular buyer of organic products',
    createdAt: '2023-03-15T10:30:00Z',
    updatedAt: '2023-07-22T14:45:00Z',
    totalOrders: 12,
    totalSpent: 4350.75
  },
  {
    id: '2',
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave, Springfield, NY 10001',
    company: 'Green Living Co',
    createdAt: '2023-04-20T09:15:00Z',
    updatedAt: '2023-06-18T11:20:00Z',
    totalOrders: 8,
    totalSpent: 2890.50
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '(555) 456-7890',
    address: '789 Pine St, Westville, FL 33101',
    company: 'Natural Foods Market',
    notes: 'Wholesale customer',
    createdAt: '2023-02-10T08:45:00Z',
    updatedAt: '2023-08-05T16:30:00Z',
    totalOrders: 24,
    totalSpent: 18750.25
  },
  {
    id: '4',
    name: 'Robert Wilson',
    email: 'robert.wilson@example.com',
    phone: '(555) 234-5678',
    address: '101 Cedar Rd, Eastport, WA 98001',
    createdAt: '2023-05-05T13:20:00Z',
    updatedAt: '2023-07-30T10:15:00Z',
    totalOrders: 5,
    totalSpent: 1240.80
  },
  {
    id: '5',
    name: 'Sarah Brown',
    email: 'sarah.brown@example.com',
    phone: '(555) 876-5432',
    address: '202 Maple Ave, Northfield, TX 75001',
    company: 'Urban Gardening Supplies',
    notes: 'Interested in bulk discounts',
    createdAt: '2023-01-25T11:10:00Z',
    updatedAt: '2023-08-12T09:45:00Z',
    totalOrders: 15,
    totalSpent: 6780.40
  }
];

interface CustomerContextType {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalOrders' | 'totalSpent'>) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
}

const CustomerContext = createContext<CustomerContextType>({} as CustomerContextType);

export const useCustomers = () => useContext(CustomerContext);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const { addNotification } = useNotifications();

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'totalOrders' | 'totalSpent'>) => {
    const now = new Date().toISOString();
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      totalOrders: 0,
      totalSpent: 0
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    
    // Send notification about new customer
    addNotification({
      title: 'New Customer Added',
      message: `${newCustomer.name} has been added to the system`,
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
    
    // Get the updated customer
    const updatedCustomer = customers.find(c => c.id === id);
    if (updatedCustomer) {
      // Send notification about update
      addNotification({
        title: 'Customer Updated',
        message: `${updatedCustomer.name}'s information has been updated`,
        type: 'success',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

  const deleteCustomer = (id: string) => {
    // Get the customer before deleting
    const customerToDelete = customers.find(c => c.id === id);
    
    setCustomers(prev => prev.filter(customer => customer.id !== id));
    
    if (customerToDelete) {
      addNotification({
        title: 'Customer Deleted',
        message: `${customerToDelete.name} has been removed from the system`,
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
      deleteCustomer
    }}>
      {children}
    </CustomerContext.Provider>
  );
};
