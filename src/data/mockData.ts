import { Product, StockMovement, User, Notification, Category } from '../types';
import { Warehouse } from '../types/warehouse';

// Mock user data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    permissions: ['manage_users', 'manage_products', 'view_reports', 'manage_inventory', 'manage_notifications'],
    avatar: 'https://i.pravatar.cc/150?img=1',
    createdAt: '2024-01-01T00:00:00.000Z',
    lastActive: '2024-04-14T14:00:00.000Z'
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@example.com',
    role: 'manager',
    permissions: ['manage_products', 'view_reports', 'manage_inventory'],
    avatar: 'https://i.pravatar.cc/150?img=2',
    createdAt: '2024-01-15T00:00:00.000Z',
    lastActive: '2024-04-13T09:30:00.000Z'
  },
  {
    id: '3',
    name: 'Staff User',
    email: 'staff@example.com',
    role: 'staff',
    permissions: ['view_reports', 'manage_inventory'],
    avatar: 'https://i.pravatar.cc/150?img=3',
    createdAt: '2024-02-01T00:00:00.000Z',
    lastActive: '2024-04-14T11:45:00.000Z'
  },
  {
    id: '4',
    name: 'Viewer User',
    email: 'viewer@example.com',
    role: 'viewer',
    permissions: ['view_reports'],
    createdAt: '2024-03-01T00:00:00.000Z',
    lastActive: '2024-04-10T16:20:00.000Z'
  }
];

// Mock product data
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop',
    sku: 'LPT-001',
    description: 'High-performance laptop for professionals',
    category: 'Electronics',
    price: 1200,
    costPrice: 900,
    quantity: 50,
    threshold: 10,
    location: 'Warehouse A',
    image: 'https://picsum.photos/id/1/200/300',
    createdAt: new Date(2023, 0, 1).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Office Chair',
    sku: 'CHR-002',
    description: 'Ergonomic office chair for comfortable seating',
    category: 'Furniture',
    price: 250,
    costPrice: 150,
    quantity: 30,
    threshold: 5,
    location: 'Warehouse B',
    image: 'https://picsum.photos/id/2/200/300',
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Notebook',
    sku: 'NBK-003',
    description: 'A5 notebook for everyday use',
    category: 'Office Supplies',
    price: 5,
    costPrice: 2,
    quantity: 200,
    threshold: 50,
    location: 'Warehouse C',
    image: 'https://picsum.photos/id/3/200/300',
    createdAt: new Date(2023, 1, 1).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Apples',
    sku: 'APP-004',
    description: 'Fresh and juicy apples',
    category: 'Groceries',
    price: 1,
    costPrice: 0.5,
    quantity: 150,
    threshold: 30,
    location: 'Warehouse D',
    image: 'https://picsum.photos/id/4/200/300',
    createdAt: new Date(2023, 1, 15).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Keyboard',
    sku: 'KEY-005',
    description: 'Wireless keyboard for desktop computers',
    category: 'Electronics',
    price: 75,
    costPrice: 45,
    quantity: 40,
    threshold: 8,
    location: 'Warehouse A',
    image: 'https://picsum.photos/id/5/200/300',
    createdAt: new Date(2023, 2, 1).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Pencils',
    sku: 'PEN-006',
    description: 'Pack of 12 graphite pencils',
    category: 'Office Supplies',
    price: 3,
    costPrice: 1,
    quantity: 300,
    threshold: 75,
    location: 'Warehouse C',
    image: 'https://picsum.photos/id/6/200/300',
    createdAt: new Date(2023, 2, 15).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Desk',
    sku: 'DSK-007',
    description: 'Wooden desk with drawers',
    category: 'Furniture',
    price: 300,
    costPrice: 180,
    quantity: 20,
    threshold: 4,
    location: 'Warehouse B',
    image: 'https://picsum.photos/id/7/200/300',
    createdAt: new Date(2023, 3, 1).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Bananas',
    sku: 'BAN-008',
    description: 'Bunch of fresh bananas',
    category: 'Groceries',
    price: 2,
    costPrice: 1,
    quantity: 100,
    threshold: 20,
    location: 'Warehouse D',
    image: 'https://picsum.photos/id/8/200/300',
    createdAt: new Date(2023, 3, 15).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '9',
    name: 'Monitor',
    sku: 'MON-009',
    description: '27-inch LED monitor',
    category: 'Electronics',
    price: 350,
    costPrice: 200,
    quantity: 30,
    threshold: 6,
    location: 'Warehouse A',
    image: 'https://picsum.photos/id/9/200/300',
    createdAt: new Date(2023, 0, 1).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '10',
    name: 'Stapler',
    sku: 'STP-010',
    description: 'Heavy-duty stapler',
    category: 'Office Supplies',
    price: 10,
    costPrice: 4,
    quantity: 100,
    threshold: 25,
    location: 'Warehouse C',
    image: 'https://picsum.photos/id/10/200/300',
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '11',
    name: 'Low Stock Product',
    sku: 'LSP-011',
    description: 'Product with low stock',
    category: 'Electronics',
    price: 50,
    costPrice: 25,
    quantity: 5,
    threshold: 10,
    location: 'Warehouse A',
    image: 'https://picsum.photos/id/11/200/300',
    createdAt: new Date(2023, 0, 1).toISOString(),
    updatedAt: new Date().toISOString()
  },
];

// Mock stock movement data
export const mockStockMovements: StockMovement[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Laptop',
    type: 'in',
    quantity: 20,
    reason: 'Initial stock received',
    date: new Date(2023, 3, 1).toISOString(),
    createdAt: new Date(2023, 3, 1).toISOString(),
    userId: '1',
    description: 'Initial stock received'
  },
  {
    id: '2',
    productId: '2',
    productName: 'Office Chair',
    type: 'in',
    quantity: 10,
    reason: 'Restock of office chairs',
    date: new Date(2023, 3, 5).toISOString(),
    createdAt: new Date(2023, 3, 5).toISOString(),
    userId: '1',
    description: 'Restock of office chairs'
  },
  {
    id: '3',
    productId: '1',
    productName: 'Laptop',
    type: 'out',
    quantity: 5,
    reason: 'Sold to customer A',
    date: new Date(2023, 3, 10).toISOString(),
    createdAt: new Date(2023, 3, 10).toISOString(),
    userId: '1',
    description: 'Sold to customer A'
  },
  {
    id: '4',
    productId: '3',
    productName: 'Notebook',
    type: 'in',
    quantity: 50,
    reason: 'New stock of notebooks',
    date: new Date(2023, 3, 15).toISOString(),
    createdAt: new Date(2023, 3, 15).toISOString(),
    userId: '1',
    description: 'New stock of notebooks'
  },
  {
    id: '5',
    productId: '11',
    productName: 'Low Stock Product',
    type: 'out',
    quantity: 2,
    reason: 'Sample product dispatched',
    date: new Date(2023, 3, 20).toISOString(),
    createdAt: new Date(2023, 3, 20).toISOString(),
    userId: '1',
    description: 'Sample product dispatched'
  },
];

// Mock notifications data
export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Low Stock Alert',
    message: 'Product "Widget A" has reached its threshold limit',
    type: 'warning',
    for: ['admin', 'manager', 'staff'],
    read: false,
    createdAt: '2024-04-14T09:00:00.000Z'
  },
  {
    id: '2',
    title: 'New Order',
    message: 'A new order #12345 has been placed',
    type: 'info',
    for: ['admin', 'manager'],
    read: true,
    createdAt: '2024-04-13T14:30:00.000Z'
  },
  {
    id: '3',
    title: 'System Update',
    message: 'The system will be undergoing maintenance on Saturday night',
    type: 'info',
    for: ['all'],
    read: false,
    createdAt: '2024-04-12T11:00:00.000Z'
  },
  {
    id: '4',
    title: 'User Added',
    message: 'New user John Doe has been added to the system',
    type: 'success',
    for: ['admin'],
    read: false,
    createdAt: '2024-04-11T16:45:00.000Z'
  }
];

// Add mock categories if they don't already exist
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    productCount: 0,
    createdAt: new Date(2023, 0, 15).toISOString()
  },
  {
    id: '2',
    name: 'Office Supplies',
    description: 'Supplies for office and business use',
    productCount: 0,
    createdAt: new Date(2023, 0, 20).toISOString()
  },
  {
    id: '3',
    name: 'Furniture',
    description: 'Office and home furniture',
    productCount: 0,
    createdAt: new Date(2023, 1, 5).toISOString()
  },
  {
    id: '4',
    name: 'Groceries',
    description: 'Food and household items',
    productCount: 0,
    createdAt: new Date(2023, 1, 10).toISOString()
  }
];

export const warehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Main Warehouse',
    address: '123 Storage Ave, Warehouse District',
    location: '123 Storage Ave, Warehouse District',
    capacity: 10000,
    currentCapacity: 7650,
    description: 'Primary storage facility',
    manager: 'John Smith',
    createdAt: new Date(2023, 0, 1).toISOString(),
    updatedAt: new Date(2023, 2, 15).toISOString()
  },
  {
    id: '2',
    name: 'Downtown Storage',
    address: '456 City Center, Downtown',
    location: '456 City Center, Downtown',
    capacity: 5000,
    currentCapacity: 3210,
    description: 'Central distribution point',
    manager: 'Emma Wilson',
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 2, 10).toISOString()
  },
  {
    id: '3',
    name: 'North Distribution Center',
    address: '789 Industrial Pkwy, North District',
    location: '789 Industrial Pkwy, North District',
    capacity: 15000,
    currentCapacity: 9870,
    description: 'Regional distribution hub',
    manager: 'Michael Chen',
    createdAt: new Date(2023, 1, 1).toISOString(),
    updatedAt: new Date(2023, 2, 5).toISOString()
  }
];
