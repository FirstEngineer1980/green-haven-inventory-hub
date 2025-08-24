
export interface User {
  id: number; // Changed from string to number to match backend
  name: string;
  email: string;
  role?: 'admin' | 'manager' | 'employee' | 'staff' | 'viewer'; // Made optional to match authTypes
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
  createdAt?: string;
}

export interface Promotion {
  id: string;
  name: string;
  title?: string;
  description: string;
  startDate: string;
  start_date?: string;
  endDate: string;
  end_date?: string;
  discount: number;
  products: string[]; // Array of product IDs
  active?: boolean;
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

export type Permission = string;

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
  skuMatrixId?: string;
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
  description?: string;
  performedBy?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  totalOrders?: number;
  totalSpent?: number;
  status?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  clinicLocations?: ClinicLocation[];
}

export interface ClinicLocation {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  timezone?: string;
  status: 'active' | 'inactive';
  notes?: string;
  customerId: string;
  customerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  customerId: string;
  customerName?: string;
  clinicLocationId: string;
  clinicLocationName?: string;
  capacity: number;
  maxUnits: number; // Maximum number of units allowed in this room
  currentUnitsCount?: number; // Current number of units in this room
  unit?: string; // Single unit identifier
  units: Unit[];
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  name: string;
  number?: string;
  roomId: string;
  roomName?: string;
  clinicLocationId: string;
  clinicLocationName?: string;
  capacity: number;
  currentStock: number;
  size?: number;
  sizeUnit?: string;
  status?: string;
  description?: string;
  lines?: UnitLine[]; // Multiple lines associated with this unit
  createdAt: string;
  updatedAt: string;
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

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  status: 'draft' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  total: number;
  items: OrderItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName?: string;
  name: string;
  quantity: number;
  price: number;
  total?: number;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UnitMatrix {
  id: string;
  name: string;
  description: string;
  roomId?: string;
  roomName?: string;
  rows: UnitMatrixRow[];
  createdAt?: string;
  updatedAt?: string;
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

export interface CustomerProduct {
  id: string;
  name: string;
  sku: string;
  qty: number;
  picture?: string;
  description?: string;
  customerId?: string; // Frontend field name
  customer_id?: string; // Backend field name
  createdAt: string;
  updatedAt: string;
}

export interface UnitLine {
  id: string;
  unitId: string;
  name: string;
  description?: string;
  capacity?: number;
  currentStock?: number;
  position?: number;
  createdAt: string;
  updatedAt: string;
}
