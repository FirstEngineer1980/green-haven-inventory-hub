
import { apiInstance } from './api';

export interface Invoice {
  id: number;
  invoice_number: string;
  type: 'salary' | 'service' | 'product' | 'commission' | 'other';
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  client_name: string;
  client_email?: string;
  client_address?: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  notes?: string;
  terms?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  items: InvoiceItem[];
  creator?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface InvoiceItem {
  id?: number;
  invoice_id?: number;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
}

export interface CreateInvoiceData {
  type: string;
  client_name: string;
  client_email?: string;
  client_address?: string;
  issue_date: string;
  due_date: string;
  tax_rate?: number;
  discount_amount?: number;
  notes?: string;
  terms?: string;
  items: Omit<InvoiceItem, 'id' | 'invoice_id' | 'total_price'>[];
}

export interface UpdateInvoiceData extends CreateInvoiceData {
  status: string;
}

export const invoiceService = {
  // Get all invoices
  getInvoices: async (params?: { status?: string; type?: string; search?: string }): Promise<any> => {
    try {
      const response = await apiInstance.get('/invoices', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  // Get single invoice
  getInvoice: async (id: number): Promise<Invoice> => {
    try {
      const response = await apiInstance.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  },

  // Create invoice
  createInvoice: async (data: CreateInvoiceData): Promise<Invoice> => {
    try {
      const response = await apiInstance.post('/invoices', data);
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  // Update invoice
  updateInvoice: async (id: number, data: UpdateInvoiceData): Promise<Invoice> => {
    try {
      const response = await apiInstance.put(`/invoices/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  // Delete invoice
  deleteInvoice: async (id: number): Promise<void> => {
    try {
      await apiInstance.delete(`/invoices/${id}`);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },

  // Update invoice status
  updateInvoiceStatus: async (id: number, status: string): Promise<Invoice> => {
    try {
      const response = await apiInstance.patch(`/invoices/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  },
};
