
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  phone?: string;
  position?: string;
  lastActive?: string;
  createdAt?: string;
  permissions?: string[];
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
  location: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  discount: number;
  products: string[]; // Array of product IDs
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  for: string[]; // Array of user roles or user IDs
  createdAt: string;
  read: boolean;
}

// Additional types that were missing
export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: 'admin' | 'manager' | 'employee' | 'staff' | 'viewer';
  permissions: Permission[];
}

export interface Bin {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentStock: number;
  products: string[];
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  createdAt: string;
  userId: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  customerId: string;
  capacity: number;
  units: Unit[];
}

export interface Unit {
  id: string;
  name: string;
  roomId: string;
  capacity: number;
  currentStock: number;
}

export interface PurchaseOrder {
  id: string;
  vendorId: string;
  status: 'pending' | 'approved' | 'received' | 'cancelled';
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  items: PurchaseOrderItem[];
  total: number;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
}

export interface UnitMatrix {
  id: string;
  name: string;
  description: string;
  rows: UnitMatrixRow[];
}

export interface UnitMatrixRow {
  id: string;
  name: string;
  cells: UnitMatrixCell[];
}

export interface UnitMatrixCell {
  id: string;
  value: string;
  productId?: string;
  quantity?: number;
}
