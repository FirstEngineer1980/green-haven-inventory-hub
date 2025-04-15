
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
  productName: string; // Added for implementation
  type: 'in' | 'out';
  quantity: number;
  description?: string;
  reason?: string; // Added for implementation
  performedBy?: string; // Added for implementation
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  company?: string; // Added for implementation
  totalOrders?: number; // Added for implementation
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
  unit?: string; // Changed to string to match implementation
  customerName?: string; // Added for implementation
  customerId?: string; // Added for implementation
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  name: string;
  number: string; // Added for implementation
  roomId: string; // Added for implementation
  roomName?: string; // Added for implementation
  size?: number; // Added for implementation
  sizeUnit?: 'sqft' | 'sqm' | 'm²'; // Added for implementation
  status?: 'available' | 'occupied' | 'maintenance'; // Added for implementation
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bin {
  id: string;
  name: string;
  roomId?: string;
  description?: string;
  length: number; // Made sure it's present
  width: number; // Made sure it's present
  height: number; // Made sure it's present
  volumeCapacity: number; // Made sure it's present
  unitMatrixId?: string; // Made sure it's present
  unitMatrixName?: string; // Added for implementation
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
  name: string; // Made sure it's present
  roomId?: string; // Made sure it's present
  roomName?: string; // Made sure it's present
  unitId?: string;
  quantity?: number;
  price?: number;
  rows?: UnitMatrixRow[]; // Made sure it's present
  createdAt: string;
  updatedAt: string;
}

// Updated to match implementation
export interface UnitMatrixRow {
  id: string;
  label: string;
  color: string;
  cells: UnitMatrixCell[];
}

// Updated to match implementation
export interface UnitMatrixCell {
  id: string;
  rowId: string;
  columnId: string;
  content: string;
  value?: string; // Added for backward compatibility
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
  poNumber: string; // Made sure it's present
  vendorId: string;
  vendorName: string; // Made sure it's present
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled'; // Updated to match implementation
  total: number; // Made sure it's present
  expectedDeliveryDate?: string; // Made sure it's present
  notes?: string; // Made sure it's present
  items: PurchaseOrderItem[]; // Made sure it's present
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactPerson?: string; // Made sure it's present
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
