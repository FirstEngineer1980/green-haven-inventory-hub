
import React, { createContext, useState, useContext } from 'react';
import { PurchaseOrder, PurchaseOrderItem, Vendor } from '../types';
import { useNotifications } from './NotificationContext';
import { useProducts } from './ProductContext';

// Mock data for vendors
const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Office Supply Co.',
    email: 'contact@officesupply.com',
    phone: '555-123-4567',
    address: '123 Business St, Commerce City',
    contact: 'Office Supply Co.',
    contactPerson: 'Jane Smith',
    createdAt: new Date(Date.now() - 7000000000).toISOString(),
    updatedAt: new Date(Date.now() - 2000000000).toISOString()
  },
  {
    id: '2',
    name: 'Tech Distributors Inc.',
    email: 'orders@techdist.com',
    phone: '555-987-6543',
    address: '456 Industry Ave, Tech Park',
    contact: 'Tech Distributors Inc.',
    contactPerson: 'Mike Johnson',
    notes: 'Preferred supplier for electronics',
    createdAt: new Date(Date.now() - 5000000000).toISOString(),
    updatedAt: new Date(Date.now() - 1000000000).toISOString()
  },
  {
    id: '3',
    name: 'Global Imports Ltd.',
    email: 'sales@globalimports.com',
    phone: '555-789-0123',
    address: '789 Trade Blvd, Port City',
    contact: 'Global Imports Ltd.',
    contactPerson: 'Sarah Lee',
    notes: 'International shipping available',
    createdAt: new Date(Date.now() - 3000000000).toISOString(),
    updatedAt: new Date(Date.now() - 500000000).toISOString()
  }
];

// Mock data for purchase orders
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    poNumber: 'PO-2025-001',
    vendorId: '1',
    vendorName: 'Office Supply Co.',
    status: 'approved',
    total: 2500.75,
    createdAt: new Date(Date.now() - 7000000000).toISOString(),
    updatedAt: new Date(Date.now() - 6000000000).toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 7000000000).toISOString(),
    items: [
      {
        id: '101',
        poId: '1',
        productId: '1',
        productName: 'Office Chair',
        quantity: 5,
        unitPrice: 199.99,
        total: 999.95
      },
      {
        id: '102',
        poId: '1',
        productId: '2',
        productName: 'Desk Lamp',
        quantity: 10,
        unitPrice: 49.99,
        total: 499.90
      },
      {
        id: '103',
        poId: '1',
        productId: '3',
        productName: 'Filing Cabinet',
        quantity: 3,
        unitPrice: 299.99,
        total: 899.97
      }
    ]
  },
  {
    id: '2',
    poNumber: 'PO-2025-002',
    vendorId: '2',
    vendorName: 'Tech Distributors Inc.',
    status: 'pending',
    total: 4200.00,
    createdAt: new Date(Date.now() - 5000000000).toISOString(),
    updatedAt: new Date(Date.now() - 4000000000).toISOString(),
    expectedDeliveryDate: new Date(Date.now() + 10000000000).toISOString(),
    notes: 'Expedited shipping requested',
    items: [
      {
        id: '201',
        poId: '2',
        productId: '4',
        productName: 'Laptop',
        quantity: 2,
        unitPrice: 1200.00,
        total: 2400.00
      },
      {
        id: '202',
        poId: '2',
        productId: '5',
        productName: 'Monitor',
        quantity: 3,
        unitPrice: 300.00,
        total: 900.00
      },
      {
        id: '203',
        poId: '2',
        productId: '6',
        productName: 'Keyboard',
        quantity: 6,
        unitPrice: 150.00,
        total: 900.00
      }
    ]
  }
];

interface POContextType {
  purchaseOrders: PurchaseOrder[];
  vendors: Vendor[];
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrder>) => void;
  deletePurchaseOrder: (id: string) => void;
  receivePurchaseOrder: (id: string) => void;
  addVendor: (vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateVendor: (id: string, updates: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  getPurchaseOrder: (id: string) => PurchaseOrder | undefined;
  getVendor: (id: string) => Vendor | undefined;
}

const POContext = createContext<POContextType>({} as POContextType);

export const usePO = () => useContext(POContext);

export const POProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const { addNotification } = useNotifications();
  const { addStockMovement } = useProducts();

  const addPurchaseOrder = (po: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newPO: PurchaseOrder = {
      ...po,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    };
    
    setPurchaseOrders(prev => [...prev, newPO]);
    
    addNotification({
      title: 'Purchase Order Created',
      message: `PO ${newPO.poNumber} has been created`,
      type: 'info',
      for: ['1', '2'], // Admin, Manager
    });
  };

  const updatePurchaseOrder = (id: string, updates: Partial<PurchaseOrder>) => {
    setPurchaseOrders(prev => 
      prev.map(po => 
        po.id === id 
          ? { ...po, ...updates, updatedAt: new Date().toISOString() } 
          : po
      )
    );
    
    const updatedPO = purchaseOrders.find(p => p.id === id);
    if (updatedPO) {
      addNotification({
        title: 'Purchase Order Updated',
        message: `PO ${updatedPO.poNumber} has been updated`,
        type: 'success',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

  const deletePurchaseOrder = (id: string) => {
    const poToDelete = purchaseOrders.find(p => p.id === id);
    
    setPurchaseOrders(prev => prev.filter(po => po.id !== id));
    
    if (poToDelete) {
      addNotification({
        title: 'Purchase Order Deleted',
        message: `PO ${poToDelete.poNumber} has been deleted`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

  const receivePurchaseOrder = (id: string) => {
    const po = purchaseOrders.find(p => p.id === id);
    if (!po) return;
    
    // Update PO status
    updatePurchaseOrder(id, { status: 'received' });
    
    // Add stock movements for each item
    po.items.forEach(item => {
      addStockMovement({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        type: 'in',
        reason: `Received from PO ${po.poNumber}`,
        performedBy: 'System' // In a real app, this would be the current user
      });
    });
    
    addNotification({
      title: 'Purchase Order Received',
      message: `PO ${po.poNumber} has been marked as received and inventory updated`,
      type: 'success',
      for: ['1', '2', '3'], // Admin, Manager, Staff
    });
  };

  const addVendor = (vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newVendor: Vendor = {
      ...vendor,
      contact: vendor.name, // Default contact to name if not provided
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now
    };
    
    setVendors(prev => [...prev, newVendor]);
    
    addNotification({
      title: 'Vendor Added',
      message: `${newVendor.name} has been added to vendors`,
      type: 'info',
      for: ['1', '2'], // Admin, Manager
    });
  };

  const updateVendor = (id: string, updates: Partial<Vendor>) => {
    setVendors(prev => 
      prev.map(vendor => 
        vendor.id === id 
          ? { ...vendor, ...updates, updatedAt: new Date().toISOString() } 
          : vendor
      )
    );
    
    const updatedVendor = vendors.find(v => v.id === id);
    if (updatedVendor) {
      addNotification({
        title: 'Vendor Updated',
        message: `${updatedVendor.name} information has been updated`,
        type: 'success',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

  const deleteVendor = (id: string) => {
    const vendorToDelete = vendors.find(v => v.id === id);
    
    setVendors(prev => prev.filter(vendor => vendor.id !== id));
    
    if (vendorToDelete) {
      addNotification({
        title: 'Vendor Deleted',
        message: `${vendorToDelete.name} has been removed from vendors`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

  const getPurchaseOrder = (id: string) => {
    return purchaseOrders.find(po => po.id === id);
  };

  const getVendor = (id: string) => {
    return vendors.find(vendor => vendor.id === id);
  };

  return (
    <POContext.Provider value={{ 
      purchaseOrders, 
      vendors,
      addPurchaseOrder, 
      updatePurchaseOrder, 
      deletePurchaseOrder,
      receivePurchaseOrder,
      addVendor,
      updateVendor,
      deleteVendor,
      getPurchaseOrder,
      getVendor
    }}>
      {children}
    </POContext.Provider>
  );
};
