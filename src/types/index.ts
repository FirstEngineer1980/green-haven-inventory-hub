
export type Role = 'admin' | 'manager' | 'staff' | 'viewer';

export type Permission = 
  | 'manage_users' 
  | 'manage_products' 
  | 'view_reports' 
  | 'manage_inventory' 
  | 'manage_notifications';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  permissions: Permission[];
  createdAt: string;
  lastActive?: string;
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

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentCapacity: number;
  manager: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  for: string[];
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  type: 'in' | 'out';
  reason: string;
  performedBy: string;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'paused' | 'inactive';
}

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

export interface Room {
  id: string;
  customerId: string;
  customerName: string;
  name: string;
  unit: number;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  roomId: string;
  roomName: string;
  number: string;
  size: number;
  sizeUnit: 'sqft' | 'sqm' | 'm²';
  status: 'available' | 'occupied' | 'maintenance';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UnitMatrix {
  id: string;
  roomId: string;
  roomName: string; 
  name: string;
  rows: UnitMatrixRow[];
  createdAt: string;
  updatedAt: string;
}

export interface UnitMatrixRow {
  id: string;
  label: string;
  color: string;
  cells: UnitMatrixCell[];
}

export interface UnitMatrixCell {
  id: string;
  value: string;
  columnId: string;
}

export interface UnitMatrixColumn {
  id: string;
  label: string;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  totalValue: number;
  recentMovements: StockMovement[];
  productsByCategory: {
    category: string;
    count: number;
  }[];
  stockTrend: {
    date: string;
    inStock: number;
  }[];
}
