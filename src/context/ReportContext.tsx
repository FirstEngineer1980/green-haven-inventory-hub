
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

export interface Report {
  id: string;
  name: string;
  description?: string;
  type: string;
  params?: Record<string, any>;
  schedule?: string;
  lastRun?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ReportContextType {
  reports: Report[];
  loading: boolean;
  error: string | null;
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateReport: (id: string, updates: Partial<Report>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  getReportById: (id: string) => Report | undefined;
  runReport: (id: string) => Promise<any>;
  fetchReports: () => Promise<void>;
}

const ReportContext = createContext<ReportContextType>({} as ReportContextType);

export const useReports = () => useContext(ReportContext);

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const fetchReports = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.get('/reports');
      setReports(response.data);
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const getReportById = (id: string): Report | undefined => {
    return reports.find(report => report.id === id);
  };

  const addReport = async (report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.post('/reports', report);
      setReports(prev => [...prev, response.data]);
      
      addNotification({
        title: 'Report Created',
        message: `Report "${response.data.name}" has been created`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    } catch (err: any) {
      console.error('Error adding report:', err);
      setError('Failed to add report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReport = async (id: string, updates: Partial<Report>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.put(`/reports/${id}`, updates);
      setReports(prev => 
        prev.map(report => 
          report.id === id ? response.data : report
        )
      );
    } catch (err: any) {
      console.error('Error updating report:', err);
      setError('Failed to update report');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id: string) => {
    if (!user) return;
    
    const reportToDelete = reports.find(report => report.id === id);
    
    try {
      await apiInstance.delete(`/reports/${id}`);
      setReports(prev => prev.filter(report => report.id !== id));
      
      if (reportToDelete) {
        addNotification({
          title: 'Report Deleted',
          message: `Report "${reportToDelete.name}" has been removed`,
          type: 'info',
          for: ['1', '2'], // Admin, Manager
        });
      }
    } catch (err: any) {
      console.error('Error deleting report:', err);
      setError('Failed to delete report');
      throw err;
    }
  };

  const runReport = async (id: string) => {
    if (!user) return;
    
    try {
      const response = await apiInstance.post(`/reports/${id}/run`);
      
      // Update the lastRun timestamp
      setReports(prev => 
        prev.map(report => 
          report.id === id ? { ...report, lastRun: new Date().toISOString() } : report
        )
      );
      
      return response.data;
    } catch (err: any) {
      console.error('Error running report:', err);
      setError('Failed to run report');
      throw err;
    }
  };

  return (
    <ReportContext.Provider value={{ 
      reports, 
      loading,
      error,
      addReport, 
      updateReport, 
      deleteReport,
      getReportById,
      runReport,
      fetchReports
    }}>
      {children}
    </ReportContext.Provider>
  );
};
