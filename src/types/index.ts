
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
  length: number;
  width: number;
  height: number;
  volumeCapacity: number;
  location: string;
  unitMatrixId?: string;
  roomId?: string;
  status?: string;
  currentStock: number;
  products: string[];
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  reason: string;
  date: string;
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
  customerName?: string;
  capacity: number;
  units: Unit[];
  createdAt: string;
  updatedAt: string;
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
  poNumber: string;
  vendorId: string;
  vendorName: string;
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';
  orderDate: string;
  expectedDate?: string;
  expectedDeliveryDate?: string;
  receivedDate?: string;
  items: PurchaseOrderItem[];
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  total: number;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  createdAt: string;
}

export interface UnitMatrix {
  id: string;
  name: string;
  description: string;
  roomId?: string;
  rows: UnitMatrixRow[];
}

export interface UnitMatrixRow {
  id: string;
  name: string;
  label?: string;
  color?: string;
  cells: UnitMatrixCell[];
}

export interface UnitMatrixCell {
  id: string;
  value: string;
  content?: string;
  columnId?: string;
  productId?: string;
  quantity?: number;
}
