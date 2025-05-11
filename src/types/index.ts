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
  phone?: string;
  position?: string;
  createdAt: string;
  lastActive: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  discount: number;
  categories: string[];
  active: boolean;
  image?: string;
  products?: Product[];
  created_at: string;
  updated_at: string;
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
  promotion?: string;
  discounted_price?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  quantity: number;
  description?: string;
  reason?: string;
  performedBy?: string;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  company?: string;
  totalOrders?: number;
  totalSpent?: number;
  status?: 'active' | 'paused' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProduct {
  id: string;
  customer_id: string;
  name: string;
  sku: string;
  qty: number;
  description?: string;
  picture?: string;
  category?: string;
  location?: string;
  status?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerList {
  id: string;
  customer_id: string;
  name: string;
  sku: string;
  quantity: string;
  description?: string;
  picture?: string;
  notes?: string;
  category?: string;
  status?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  unit?: string;
  customerName?: string;
  customerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  name: string;
  number: string;
  roomId: string;
  roomName?: string;
  size?: number;
  sizeUnit?: 'sqft' | 'sqm' | 'm²';
  status?: 'available' | 'occupied' | 'maintenance';
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bin {
  id: string;
  name: string;
  roomId?: string;
  description?: string;
  length: number;
  width: number;
  height: number;
  volumeCapacity: number;
  unitMatrixId?: string;
  unitMatrixName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UnitMatrixColumn {
  id: string;
  label: string;
}

export interface UnitMatrix {
  id: string;
  productId?: string;
  name: string;
  roomId?: string;
  roomName?: string;
  unitId?: string;
  quantity?: number;
  price?: number;
  rows?: UnitMatrixRow[];
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
  rowId: string;
  columnId: string;
  content: string;
  value?: string;
}

export interface PurchaseOrderItem {
  id: string;
  poId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';
  total: number;
  expectedDeliveryDate?: string;
  notes?: string;
  items: PurchaseOrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
