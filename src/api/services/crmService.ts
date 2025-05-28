
import { apiInstance } from './api';
import { Seller, Client } from '@/types/crm';

export const crmService = {
  // Seller services
  getSellers: async (): Promise<Seller[]> => {
    try {
      const response = await apiInstance.get('/sellers');
      return response.data;
    } catch (error) {
      console.error('Error fetching sellers:', error);
      throw error;
    }
  },

  getSeller: async (id: string): Promise<Seller> => {
    try {
      const response = await apiInstance.get(`/sellers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching seller ${id}:`, error);
      throw error;
    }
  },

  createSeller: async (seller: Omit<Seller, 'id' | 'created_at' | 'updated_at'>): Promise<Seller> => {
    try {
      const response = await apiInstance.post('/sellers', seller);
      return response.data;
    } catch (error) {
      console.error('Error creating seller:', error);
      throw error;
    }
  },

  updateSeller: async (id: string, seller: Partial<Seller>): Promise<Seller> => {
    try {
      const response = await apiInstance.put(`/sellers/${id}`, seller);
      return response.data;
    } catch (error) {
      console.error(`Error updating seller ${id}:`, error);
      throw error;
    }
  },

  deleteSeller: async (id: string): Promise<void> => {
    try {
      await apiInstance.delete(`/sellers/${id}`);
    } catch (error) {
      console.error(`Error deleting seller ${id}:`, error);
      throw error;
    }
  },

  // Client services
  getClients: async (): Promise<Client[]> => {
    try {
      const response = await apiInstance.get('/clients');
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  getClient: async (id: string): Promise<Client> => {
    try {
      const response = await apiInstance.get(`/clients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching client ${id}:`, error);
      throw error;
    }
  },

  createClient: async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> => {
    try {
      const response = await apiInstance.post('/clients', client);
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  updateClient: async (id: string, client: Partial<Client>): Promise<Client> => {
    try {
      const response = await apiInstance.put(`/clients/${id}`, client);
      return response.data;
    } catch (error) {
      console.error(`Error updating client ${id}:`, error);
      throw error;
    }
  },

  deleteClient: async (id: string): Promise<void> => {
    try {
      await apiInstance.delete(`/clients/${id}`);
    } catch (error) {
      console.error(`Error deleting client ${id}:`, error);
      throw error;
    }
  },
};
