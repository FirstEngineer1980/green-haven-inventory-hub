
import { apiInstance } from './api';

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  status: 'draft' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  order_date: string;
  delivery_date?: string;
  notes?: string;
  created_by: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  product_sku?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
}

// Interface for creating new orders (without generated fields)
export interface CreateOrderData {
  customer_id: string;
  status: Order['status'];
  order_date: string;
  delivery_date?: string;
  notes?: string;
  items: {
    product_name: string;
    product_sku?: string;
    quantity: number;
    unit_price: number;
    notes?: string;
  }[];
}

export const orderService = {
  // Get all orders
  getOrders: async (params?: { status?: string; search?: string }): Promise<Order[]> => {
    try {
      const response = await apiInstance.get('/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  // Get single order
  getOrder: async (id: string): Promise<Order> => {
    try {
      const response = await apiInstance.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching order ${id}:`, error);
      throw error;
    }
  },

  // Create order
  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    try {
      const response = await apiInstance.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Update order
  updateOrder: async (id: string, orderData: Partial<CreateOrderData>): Promise<Order> => {
    try {
      const response = await apiInstance.put(`/orders/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      throw error;
    }
  },

  // Delete order
  deleteOrder: async (id: string): Promise<void> => {
    try {
      await apiInstance.delete(`/orders/${id}`);
    } catch (error) {
      console.error(`Error deleting order ${id}:`, error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order> => {
    try {
      const response = await apiInstance.patch(`/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating order ${id} status:`, error);
      throw error;
    }
  },
};
