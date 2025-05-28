
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { apiInstance } from '../api/services/api';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: string;
  variables?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EmailTemplateContextType {
  emailTemplates: EmailTemplate[];
  loading: boolean;
  error: string | null;
  addEmailTemplate: (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEmailTemplate: (id: string, updates: Partial<EmailTemplate>) => Promise<void>;
  deleteEmailTemplate: (id: string) => Promise<void>;
  getEmailTemplateById: (id: string) => EmailTemplate | undefined;
  fetchEmailTemplates: () => Promise<void>;
}

const EmailTemplateContext = createContext<EmailTemplateContextType>({} as EmailTemplateContextType);

export const useEmailTemplates = () => useContext(EmailTemplateContext);

export const EmailTemplateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const fetchEmailTemplates = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await apiInstance.get('/email-templates');
      setEmailTemplates(response.data);
    } catch (err: any) {
      console.error('Error fetching email templates:', err);
      setError('Failed to fetch email templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchEmailTemplates();
    }
  }, [user]);

  const getEmailTemplateById = (id: string): EmailTemplate | undefined => {
    return emailTemplates.find(template => template.id === id);
  };

  const addEmailTemplate = async (template: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.post('/email-templates', template);
      setEmailTemplates(prev => [...prev, response.data]);
      
      addNotification({
        title: 'Email Template Added',
        message: `Email template "${response.data.name}" has been created`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    } catch (err: any) {
      console.error('Error adding email template:', err);
      setError('Failed to add email template');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEmailTemplate = async (id: string, updates: Partial<EmailTemplate>) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiInstance.put(`/email-templates/${id}`, updates);
      setEmailTemplates(prev => 
        prev.map(template => 
          template.id === id ? response.data : template
        )
      );
    } catch (err: any) {
      console.error('Error updating email template:', err);
      setError('Failed to update email template');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmailTemplate = async (id: string) => {
    if (!user) return;
    
    const templateToDelete = emailTemplates.find(template => template.id === id);
    
    try {
      await apiInstance.delete(`/email-templates/${id}`);
      setEmailTemplates(prev => prev.filter(template => template.id !== id));
      
      if (templateToDelete) {
        addNotification({
          title: 'Email Template Deleted',
          message: `Email template "${templateToDelete.name}" has been removed`,
          type: 'info',
          for: ['1', '2'], // Admin, Manager
        });
      }
    } catch (err: any) {
      console.error('Error deleting email template:', err);
      setError('Failed to delete email template');
      throw err;
    }
  };

  return (
    <EmailTemplateContext.Provider value={{ 
      emailTemplates, 
      loading,
      error,
      addEmailTemplate, 
      updateEmailTemplate, 
      deleteEmailTemplate,
      getEmailTemplateById,
      fetchEmailTemplates
    }}>
      {children}
    </EmailTemplateContext.Provider>
  );
};
