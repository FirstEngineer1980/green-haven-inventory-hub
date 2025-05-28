
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

export interface SmsTemplate {
  id: string;
  name: string;
  message: string;
  type: string;
  variables?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SmsTemplateContextType {
  smsTemplates: SmsTemplate[];
  loading: boolean;
  error: string | null;
  addSmsTemplate: (template: Omit<SmsTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSmsTemplate: (id: string, updates: Partial<SmsTemplate>) => Promise<void>;
  deleteSmsTemplate: (id: string) => Promise<void>;
  getSmsTemplateById: (id: string) => SmsTemplate | undefined;
  fetchSmsTemplates: () => Promise<void>;
}

const SmsTemplateContext = createContext<SmsTemplateContextType>({} as SmsTemplateContextType);

export const useSmsTemplates = () => useContext(SmsTemplateContext);

export const SmsTemplateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const fetchSmsTemplates = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.get('/sms-templates');
      setSmsTemplates(response.data);
    } catch (err: any) {
      console.error('Error fetching SMS templates:', err);
      setError('Failed to fetch SMS templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSmsTemplates();
    }
  }, [user]);

  const getSmsTemplateById = (id: string): SmsTemplate | undefined => {
    return smsTemplates.find(template => template.id === id);
  };

  const addSmsTemplate = async (template: Omit<SmsTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.post('/sms-templates', template);
      setSmsTemplates(prev => [...prev, response.data]);
      
      addNotification({
        title: 'SMS Template Added',
        message: `SMS template "${response.data.name}" has been created`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    } catch (err: any) {
      console.error('Error adding SMS template:', err);
      setError('Failed to add SMS template');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSmsTemplate = async (id: string, updates: Partial<SmsTemplate>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.put(`/sms-templates/${id}`, updates);
      setSmsTemplates(prev => 
        prev.map(template => 
          template.id === id ? response.data : template
        )
      );
    } catch (err: any) {
      console.error('Error updating SMS template:', err);
      setError('Failed to update SMS template');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSmsTemplate = async (id: string) => {
    if (!user) return;
    
    const templateToDelete = smsTemplates.find(template => template.id === id);
    
    try {
      await apiInstance.delete(`/sms-templates/${id}`);
      setSmsTemplates(prev => prev.filter(template => template.id !== id));
      
      if (templateToDelete) {
        addNotification({
          title: 'SMS Template Deleted',
          message: `SMS template "${templateToDelete.name}" has been removed`,
          type: 'info',
          for: ['1', '2'], // Admin, Manager
        });
      }
    } catch (err: any) {
      console.error('Error deleting SMS template:', err);
      setError('Failed to delete SMS template');
      throw err;
    }
  };

  return (
    <SmsTemplateContext.Provider value={{ 
      smsTemplates, 
      loading,
      error,
      addSmsTemplate, 
      updateSmsTemplate, 
      deleteSmsTemplate,
      getSmsTemplateById,
      fetchSmsTemplates
    }}>
      {children}
    </SmsTemplateContext.Provider>
  );
};
