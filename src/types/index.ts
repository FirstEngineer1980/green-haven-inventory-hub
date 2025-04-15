export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  createdAt?: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  for: string[];
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  cost: number;
  price: number;
  image: string;
  categoryId: string;
  categoryName?: string;
  vendorId: string;
  vendorName?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
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
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
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

export interface PO {
  id: string;
  vendorId: string;
  vendorName?: string;
  items: POItem[];
  total: number;
  status: 'open' | 'closed';
  createdAt?: string;
  updatedAt?: string;
}

export interface POItem {
  productId: string;
  productName?: string;
  quantity: number;
  price: number;
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
  inventoryItemId: string;
  inventoryItemName?: string;
  quantityChange: number;
  type: 'in' | 'out';
  reason: string;
  createdAt?: string;
}

export interface Bin {
  id: string;
  name: string;
  description: string;
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
