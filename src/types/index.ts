

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee' | 'staff' | 'viewer';
  permissions?: Permission[];
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  lastActive?: string;
}

export type Permission = 'manage_users' | 'manage_products' | 'view_reports' | 'manage_inventory' | 'manage_notifications';
export type Role = 'admin' | 'manager' | 'staff' | 'viewer';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  for: string[];
  createdAt: string;
  read?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  cost: number;
  price: number;
  image: string;
  quantity?: number;
  threshold?: number;
  categoryId: string;
  categoryName?: string;
  vendorId: string;
  vendorName?: string;
  category?: string; // Used in mock data
  costPrice?: number; // Used in mock data
  location?: string; // Used in mock data
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount?: number; // Used in mock data
  createdAt?: string;
  updatedAt?: string;
}

export interface Vendor {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  contactPerson?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  contact?: string; // Make it optional to match actual usage
  email: string;
  phone: string;
  address: string;
  company?: string;
  notes?: string;
  status?: 'active' | 'paused' | 'inactive';
  totalOrders?: number;
  totalSpent?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerProduct {
  id: string;
  customerId: string;
  customerName?: string;
  productId: string;
  productName?: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Room {
  id: string;
  customerId: string;
  customerName?: string;
  name: string;
  unit: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Unit {
  id: string;
  roomId: string;
  roomName?: string;
  number: string;
  size: number;
  sizeUnit: 'sqft' | 'sqm' | 'm²';
  status: 'available' | 'occupied' | 'maintenance';
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName?: string;
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';
  total: number;
  notes?: string;
  expectedDeliveryDate?: string;
  items: PurchaseOrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseOrderItem {
  id: string;
  poId: string;
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName?: string;
  unitId: string;
  unitNumber?: string;
  skuMatrixRowId: string;
  skuMatrixRowLabel?: string;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName?: string;
  quantity: number;
  quantityChange?: number;
  type: 'in' | 'out';
  reason: string;
  performedBy?: string;
  date?: string;
  createdAt?: string;
}

export interface Bin {
  id: string;
  name: string;
  description?: string; // Make it optional to match actual usage
  length: number;
  width: number;
  height: number;
  volumeCapacity: number;
  unitMatrixId?: string;
  unitMatrixName?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UnitMatrixCell {
  id: string;
  value: string;
  columnId: string;
}

export interface UnitMatrixRow {
  id: string;
  label: string;
  color: string;
  cells: UnitMatrixCell[];
}

export interface UnitMatrixColumn {
  id: string;
  label: string;
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

// Additional types used in mock data
export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentCapacity: number;
  manager: string;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  totalValue: number;
  recentMovements: StockMovement[];
  productsByCategory: { category: string; count: number }[];
  stockTrend: { date: string; inStock: number }[];
}

