
import { User, Product, Category, Warehouse, Notification, StockMovement, DashboardStats } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@greenhaven.com',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=74c696&color=fff',
    role: 'admin',
    permissions: ['manage_users', 'manage_products', 'view_reports', 'manage_inventory', 'manage_notifications'],
    createdAt: '2025-01-15T08:30:00Z',
    lastActive: '2025-04-08T10:15:00Z'
  },
  {
    id: '2',
    name: 'John Manager',
    email: 'john@greenhaven.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Manager&background=6bacde&color=fff',
    role: 'manager',
    permissions: ['manage_products', 'view_reports', 'manage_inventory'],
    createdAt: '2025-01-20T09:15:00Z',
    lastActive: '2025-04-07T16:30:00Z'
  },
  {
    id: '3',
    name: 'Sarah Staff',
    email: 'sarah@greenhaven.com',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Staff&background=ffd166&color=fff',
    role: 'staff',
    permissions: ['view_reports', 'manage_inventory'],
    createdAt: '2025-02-10T14:20:00Z',
    lastActive: '2025-04-08T09:45:00Z'
  },
  {
    id: '4',
    name: 'Michael Viewer',
    email: 'michael@greenhaven.com',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Viewer&background=ef476f&color=fff',
    role: 'viewer',
    permissions: ['view_reports'],
    createdAt: '2025-03-05T11:10:00Z',
    lastActive: '2025-04-05T13:20:00Z'
  }
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Electronic devices and accessories',
    productCount: 15
  },
  {
    id: '2',
    name: 'Office Supplies',
    description: 'Office essentials and stationery',
    productCount: 22
  },
  {
    id: '3',
    name: 'Furniture',
    description: 'Office and home furniture',
    productCount: 8
  },
  {
    id: '4',
    name: 'Tools',
    description: 'Hand and power tools',
    productCount: 12
  }
];

export const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Main Warehouse',
    location: '123 Logistics Way, Portland',
    capacity: 1000,
    currentCapacity: 650,
    manager: 'John Manager'
  },
  {
    id: '2',
    name: 'East Storage',
    location: '456 Industrial Blvd, Boston',
    capacity: 750,
    currentCapacity: 320,
    manager: 'Sarah Staff'
  },
  {
    id: '3',
    name: 'West Distribution',
    location: '789 Shipping Lane, Seattle',
    capacity: 1200,
    currentCapacity: 980,
    manager: 'John Manager'
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop Computer',
    sku: 'ELEC-001',
    description: 'High-performance laptop with 16GB RAM',
    category: 'Electronics',
    price: 1299.99,
    costPrice: 950.00,
    quantity: 15,
    threshold: 5,
    location: 'Main Warehouse',
    image: 'https://placehold.co/400x400?text=Laptop',
    createdAt: '2025-01-15T08:30:00Z',
    updatedAt: '2025-04-02T10:15:00Z'
  },
  {
    id: '2',
    name: 'Office Chair',
    sku: 'FURN-001',
    description: 'Ergonomic office chair with lumbar support',
    category: 'Furniture',
    price: 249.99,
    costPrice: 150.00,
    quantity: 3,
    threshold: 5,
    location: 'Main Warehouse',
    image: 'https://placehold.co/400x400?text=Chair',
    createdAt: '2025-01-20T09:15:00Z',
    updatedAt: '2025-04-01T16:30:00Z'
  },
  {
    id: '3',
    name: 'Wireless Mouse',
    sku: 'ELEC-002',
    description: 'Bluetooth wireless mouse',
    category: 'Electronics',
    price: 29.99,
    costPrice: 15.00,
    quantity: 42,
    threshold: 10,
    location: 'East Storage',
    image: 'https://placehold.co/400x400?text=Mouse',
    createdAt: '2025-02-10T14:20:00Z',
    updatedAt: '2025-03-28T09:45:00Z'
  },
  {
    id: '4',
    name: 'Notebook Pack',
    sku: 'OFSP-001',
    description: 'Pack of 5 ruled notebooks',
    category: 'Office Supplies',
    price: 18.99,
    costPrice: 8.50,
    quantity: 85,
    threshold: 20,
    location: 'East Storage',
    image: 'https://placehold.co/400x400?text=Notebooks',
    createdAt: '2025-02-15T11:10:00Z',
    updatedAt: '2025-03-30T13:20:00Z'
  },
  {
    id: '5',
    name: 'Power Drill',
    sku: 'TOOL-001',
    description: 'Cordless power drill with battery pack',
    category: 'Tools',
    price: 89.99,
    costPrice: 45.00,
    quantity: 7,
    threshold: 5,
    location: 'West Distribution',
    image: 'https://placehold.co/400x400?text=Drill',
    createdAt: '2025-03-05T10:45:00Z',
    updatedAt: '2025-04-03T15:50:00Z'
  },
  {
    id: '6',
    name: 'Desktop Monitor',
    sku: 'ELEC-003',
    description: '27-inch 4K monitor',
    category: 'Electronics',
    price: 349.99,
    costPrice: 220.00,
    quantity: 4,
    threshold: 3,
    location: 'Main Warehouse',
    image: 'https://placehold.co/400x400?text=Monitor',
    createdAt: '2025-03-10T08:30:00Z',
    updatedAt: '2025-04-05T10:15:00Z'
  },
  {
    id: '7',
    name: 'Filing Cabinet',
    sku: 'FURN-002',
    description: '3-drawer metal filing cabinet',
    category: 'Furniture',
    price: 139.99,
    costPrice: 85.00,
    quantity: 12,
    threshold: 4,
    location: 'West Distribution',
    image: 'https://placehold.co/400x400?text=Cabinet',
    createdAt: '2025-03-15T09:15:00Z',
    updatedAt: '2025-04-06T16:30:00Z'
  },
  {
    id: '8',
    name: 'Printer Paper',
    sku: 'OFSP-002',
    description: 'Premium printer paper, 500 sheets',
    category: 'Office Supplies',
    price: 12.99,
    costPrice: 6.00,
    quantity: 2,
    threshold: 15,
    location: 'East Storage',
    image: 'https://placehold.co/400x400?text=Paper',
    createdAt: '2025-03-20T14:20:00Z',
    updatedAt: '2025-04-07T09:45:00Z'
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Low Stock Alert',
    message: 'Office Chair is below the threshold quantity',
    type: 'warning',
    read: false,
    createdAt: '2025-04-08T08:30:00Z',
    for: ['1', '2']
  },
  {
    id: '2',
    title: 'Low Stock Alert',
    message: 'Printer Paper is below the threshold quantity',
    type: 'warning',
    read: false,
    createdAt: '2025-04-08T09:15:00Z',
    for: ['1', '2']
  },
  {
    id: '3',
    title: 'New Product Added',
    message: 'Power Drill has been added to inventory',
    type: 'info',
    read: true,
    createdAt: '2025-04-03T10:45:00Z',
    for: ['1', '2', '3', '4']
  },
  {
    id: '4',
    title: 'Inventory Updated',
    message: 'Laptop Computer inventory has been updated',
    type: 'success',
    read: true,
    createdAt: '2025-04-02T14:20:00Z',
    for: ['1', '2', '3']
  },
  {
    id: '5',
    title: 'User Added',
    message: 'New user Michael Viewer has been added to the system',
    type: 'info',
    read: true,
    createdAt: '2025-03-05T11:10:00Z',
    for: ['1']
  }
];

export const mockStockMovements: StockMovement[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Laptop Computer',
    quantity: 5,
    type: 'in',
    reason: 'Restock',
    performedBy: 'John Manager',
    date: '2025-04-02T10:15:00Z'
  },
  {
    id: '2',
    productId: '3',
    productName: 'Wireless Mouse',
    quantity: 10,
    type: 'in',
    reason: 'Restock',
    performedBy: 'Sarah Staff',
    date: '2025-03-28T09:45:00Z'
  },
  {
    id: '3',
    productId: '8',
    productName: 'Printer Paper',
    quantity: 8,
    type: 'out',
    reason: 'Sale',
    performedBy: 'Sarah Staff',
    date: '2025-04-07T09:45:00Z'
  },
  {
    id: '4',
    productId: '2',
    productName: 'Office Chair',
    quantity: 2,
    type: 'out',
    reason: 'Sale',
    performedBy: 'John Manager',
    date: '2025-04-01T16:30:00Z'
  },
  {
    id: '5',
    productId: '5',
    productName: 'Power Drill',
    quantity: 3,
    type: 'in',
    reason: 'Restock',
    performedBy: 'John Manager',
    date: '2025-04-03T15:50:00Z'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalProducts: mockProducts.length,
  lowStockProducts: mockProducts.filter(p => p.quantity <= p.threshold).length,
  totalValue: mockProducts.reduce((sum, product) => sum + (product.quantity * product.costPrice), 0),
  recentMovements: mockStockMovements.slice(0, 5),
  productsByCategory: mockCategories.map(cat => ({
    category: cat.name,
    count: cat.productCount
  })),
  stockTrend: [
    { date: '2025-03-01', inStock: 175 },
    { date: '2025-03-08', inStock: 182 },
    { date: '2025-03-15', inStock: 190 },
    { date: '2025-03-22', inStock: 176 },
    { date: '2025-03-29', inStock: 184 },
    { date: '2025-04-05', inStock: 190 },
    { date: '2025-04-08', inStock: 170 }
  ]
};
