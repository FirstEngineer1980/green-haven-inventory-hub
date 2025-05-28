
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PurchaseOrder, Vendor } from '../types';
import { useAuth } from './AuthContext';
import apiInstance from '../api/services/api';

interface POContextProps {
  purchaseOrders: PurchaseOrder[];
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  fetchPurchaseOrders: () => Promise<void>;
  fetchVendors: () => Promise<void>;
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updatePurchaseOrder: (id: string, po: Partial<PurchaseOrder>) => Promise<void>;
  deletePurchaseOrder: (id: string) => Promise<void>;
  receivePurchaseOrder: (id: string) => Promise<void>;
  addVendor: (vendor: Omit<Vendor, 'id' | 'createdAt'>) => Promise<void>;
  updateVendor: (id: string, vendor: Partial<Vendor>) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;
  getVendor: (id: string) => Vendor | undefined;
}

const POContext = createContext<POContextProps | undefined>(undefined);

export const POProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPurchaseOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await apiInstance.get('/purchase-orders');
      setPurchaseOrders(response.data);
    } catch (error: any) {
      console.error('Error fetching purchase orders:', error);
      setError('Failed to fetch purchase orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await apiInstance.get('/vendors');
      setVendors(response.data);
    } catch (error: any) {
      console.error('Error fetching vendors:', error);
      setError('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const addPurchaseOrder = async (poData: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await apiInstance.post('/purchase-orders', poData);
      setPurchaseOrders([...purchaseOrders, response.data]);
    } catch (error: any) {
      console.error('Error adding purchase order:', error);
      setError('Failed to add purchase order');
    } finally {
      setLoading(false);
    }
  };

  const updatePurchaseOrder = async (id: string, poData: Partial<PurchaseOrder>) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await apiInstance.put(`/purchase-orders/${id}`, poData);
      setPurchaseOrders(purchaseOrders.map(po => po.id === id ? response.data : po));
    } catch (error: any) {
      console.error('Error updating purchase order:', error);
      setError('Failed to update purchase order');
    } finally {
      setLoading(false);
    }
  };

  const deletePurchaseOrder = async (id: string) => {
    if (!user) return;
    try {
      await apiInstance.delete(`/purchase-orders/${id}`);
      setPurchaseOrders(purchaseOrders.filter(po => po.id !== id));
    } catch (error: any) {
      console.error('Error deleting purchase order:', error);
      setError('Failed to delete purchase order');
    }
  };

  const receivePurchaseOrder = async (id: string) => {
    if (!user) return;
    try {
      const response = await apiInstance.put(`/purchase-orders/${id}`, { status: 'received' });
      setPurchaseOrders(purchaseOrders.map(po => po.id === id ? response.data : po));
    } catch (error: any) {
      console.error('Error receiving purchase order:', error);
      setError('Failed to receive purchase order');
    }
  };

  const addVendor = async (vendorData: Omit<Vendor, 'id' | 'createdAt'>) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await apiInstance.post('/vendors', vendorData);
      setVendors([...vendors, response.data]);
    } catch (error: any) {
      console.error('Error adding vendor:', error);
      setError('Failed to add vendor');
    } finally {
      setLoading(false);
    }
  };

  const updateVendor = async (id: string, vendorData: Partial<Vendor>) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await apiInstance.put(`/vendors/${id}`, vendorData);
      setVendors(vendors.map(vendor => vendor.id === id ? response.data : vendor));
    } catch (error: any) {
      console.error('Error updating vendor:', error);
      setError('Failed to update vendor');
    } finally {
      setLoading(false);
    }
  };

  const deleteVendor = async (id: string) => {
    if (!user) return;
    try {
      await apiInstance.delete(`/vendors/${id}`);
      setVendors(vendors.filter(vendor => vendor.id !== id));
    } catch (error: any) {
      console.error('Error deleting vendor:', error);
      setError('Failed to delete vendor');
    }
  };

  const getVendor = (id: string) => {
    return vendors.find(vendor => vendor.id === id);
  };

  const value: POContextProps = {
    purchaseOrders,
    vendors,
    loading,
    error,
    fetchPurchaseOrders,
    fetchVendors,
    addPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    receivePurchaseOrder,
    addVendor,
    updateVendor,
    deleteVendor,
    getVendor,
  };

  return (
    <POContext.Provider value={value}>
      {children}
    </POContext.Provider>
  );
};

export const usePO = (): POContextProps => {
  const context = useContext(POContext);
  if (!context) {
    throw new Error('usePO must be used within a POProvider');
  }
  return context;
};
