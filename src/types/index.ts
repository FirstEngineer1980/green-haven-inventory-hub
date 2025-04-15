
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
  productName: string; // Added to match implementation
  type: 'in' | 'out';
  quantity: number;
  description?: string;
  reason?: string; // Added to match implementation
  performedBy?: string; // Added to match implementation
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
  unit?: string; // Added to match implementation
  customerName?: string; // Added to match implementation
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
  roomId?: string;
  description?: string;
  length: number; // Added to match implementation
  width: number; // Added to match implementation
  height: number; // Added to match implementation
  volumeCapacity: number; // Added to match implementation
  unitMatrixId?: string; // Added to match implementation
  unitMatrixName?: string; // Added to match implementation
  createdAt: string;
  updatedAt: string;
}

export interface UnitMatrix {
  id: string;
  productId?: string;
  name?: string; // Added to match implementation
  roomId?: string; // Added to match implementation
  roomName?: string; // Added to match implementation
  unitId?: string;
  quantity?: number;
  price?: number;
  rows?: UnitMatrixRow[]; // Added to match implementation
  createdAt: string;
  updatedAt: string;
}

// Added to match implementation
export interface UnitMatrixRow {
  id: string;
  label: string;
  color: string;
  cells: UnitMatrixCell[];
}

// Added to match implementation
export interface UnitMatrixCell {
  id: string;
  rowId: string;
  columnId: string;
  content: string;
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
  poNumber: string; // Added to match implementation
  vendorId: string;
  vendorName: string; // Added to match implementation
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled'; // Updated to match implementation
  total: number; // Added to match implementation
  expectedDeliveryDate?: string; // Added to match implementation
  notes?: string; // Added to match implementation
  items: PurchaseOrderItem[]; // Added to match implementation
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson?: string; // Added to match implementation
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
