
import { apiInstance } from '../api/services/api';

// Shopify service that calls our Laravel backend
export const shopifyService = {
  // Orders
  getOrders: async (params?: any) => {
    try {
      const response = await apiInstance.get('/shopify/orders', { params });
      return response.data.orders || response.data;
    } catch (error) {
      console.error('Error fetching Shopify orders:', error);
      throw error;
    }
  },

  getOrder: async (orderId: string) => {
    try {
      const response = await apiInstance.get(`/shopify/orders/${orderId}`);
      return response.data.order || response.data;
    } catch (error) {
      console.error(`Error fetching Shopify order ${orderId}:`, error);
      throw error;
    }
  },

  // Customers
  getCustomers: async (params?: any) => {
    try {
      const response = await apiInstance.get('/shopify/customers', { params });
      return response.data.customers || response.data;
    } catch (error) {
      console.error('Error fetching Shopify customers:', error);
      throw error;
    }
  },

  getCustomer: async (customerId: string) => {
    try {
      const response = await apiInstance.get(`/shopify/customers/${customerId}`);
      return response.data.customer || response.data;
    } catch (error) {
      console.error(`Error fetching Shopify customer ${customerId}:`, error);
      throw error;
    }
  },

  // Products
  getProducts: async (params?: any) => {
    try {
      const response = await apiInstance.get('/shopify/products', { params });
      return response.data.products || response.data;
    } catch (error) {
      console.error('Error fetching Shopify products:', error);
      throw error;
    }
  },

  // Sync operations
  syncOrders: async () => {
    try {
      const response = await apiInstance.post('/shopify/sync/orders');
      return response.data;
    } catch (error) {
      console.error('Error syncing Shopify orders:', error);
      throw error;
    }
  }
};

export default shopifyService;
