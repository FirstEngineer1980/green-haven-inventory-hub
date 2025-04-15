export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  for: string[]; // User roles or IDs this notification is for
  read?: boolean;
  createdAt: string;
}

export type Role = 'admin' | 'manager' | 'staff' | 'viewer';

export type Permission = 'manage_users' | 'manage_products' | 'view_reports' | 'manage_inventory' | 'manage_notifications';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: Permission[];
  avatar?: string;
  createdAt: string;
  lastActive: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  costPrice: number;
  quantity: number;
  threshold: number;
  location?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  description?: string;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProduct {
  id: string;
  customerId: string;
  productId: string;
  price: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bin {
  id: string;
  name: string;
  roomId: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UnitMatrix {
  id: string;
  productId: string;
  unitId: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  productId: string;
  quantity: number;
  price: number;
  date: string;
  status: 'open' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
