export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  phone?: string;
  position?: string;
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
  message: string;
  for: string[]; // Array of user roles or user IDs
  createdAt: string;
  read: boolean;
}
