
import { apiInstance } from './api';

export interface ExportOptions {
  fields?: string[];
  format?: 'json' | 'csv';
}

export interface ImportOptions {
  overwrite?: boolean;
}

export interface ExportLog {
  id: number;
  type: string;
  filename: string;
  exported_by: number;
  exported_at: string;
  record_count: number;
  user?: {
    name: string;
    email: string;
  };
}

export const exportImportService = {
  // Export data
  exportData: async (type: string, options: ExportOptions = {}): Promise<any> => {
    try {
      const response = await apiInstance.get(`/export/${type}`, {
        params: options,
      });
      return response.data;
    } catch (error) {
      console.error(`Error exporting ${type}:`, error);
      throw error;
    }
  },

  // Import data
  importData: async (type: string, data: any[], options: ImportOptions = {}): Promise<any> => {
    try {
      const response = await apiInstance.post(`/import/${type}`, {
        data,
        ...options,
      });
      return response.data;
    } catch (error) {
      console.error(`Error importing ${type}:`, error);
      throw error;
    }
  },

  // Get export logs
  getExportLogs: async (): Promise<ExportLog[]> => {
    try {
      const response = await apiInstance.get('/export-logs');
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error fetching export logs:', error);
      throw error;
    }
  },

  // Download exported data as file
  downloadExport: async (type: string, filename: string, data: any): Promise<void> => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${type}_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
