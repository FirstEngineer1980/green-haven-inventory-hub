
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NotifyingExportButton from '@/components/shared/NotifyingExportButton';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

// Mock data should be passed as props in a real application
const mockProducts = [
  { id: 'p1', name: 'Product 1', sku: 'SKU001', category: 'Category A', stock: 120 },
  { id: 'p2', name: 'Product 2', sku: 'SKU002', category: 'Category B', stock: 85 },
  { id: 'p3', name: 'Product 3', sku: 'SKU003', category: 'Category A', stock: 42 },
];

const mockCustomers = [
  { id: 'c1', name: 'Customer 1', email: 'customer1@example.com', company: 'Company A' },
  { id: 'c2', name: 'Customer 2', email: 'customer2@example.com', company: 'Company B' },
];

const mockMovements = [
  { id: 'm1', product: 'Product 1', quantity: 10, type: 'incoming', date: '2023-04-01' },
  { id: 'm2', product: 'Product 2', quantity: 5, type: 'outgoing', date: '2023-04-02' },
];

export const SystemSettings = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetSystem = async () => {
    if (window.confirm('WARNING: This will reset all system data. This action cannot be undone. Are you sure you want to proceed?')) {
      setIsSubmitting(true);
      try {
        await axios.post('/api/settings/reset-system');
        
        toast({
          title: "System reset",
          description: "The system has been reset successfully.",
        });
      } catch (error) {
        console.error('Error resetting system:', error);
        toast({
          title: "Reset failed",
          description: "There was an error resetting the system. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClearAllData = async () => {
    if (window.confirm('WARNING: This will clear all data from the system. This action cannot be undone. Are you sure you want to proceed?')) {
      setIsSubmitting(true);
      try {
        await axios.post('/api/settings/clear-data');
        
        toast({
          title: "Data cleared",
          description: "All data has been cleared from the system.",
        });
      } catch (error) {
        console.error('Error clearing data:', error);
        toast({
          title: "Clear failed",
          description: "There was an error clearing the data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>View system details and configuration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Version</p>
              <p>Green Haven ERP v1.0.0</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p>April 8, 2025</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Database Status</p>
              <p className="text-green-600">Connected</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">API Status</p>
              <p className="text-green-600">Operational</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Manage your system data and backups.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm">Export inventory data for backup or reporting purposes.</p>
            <div className="flex gap-3 flex-wrap">
              <NotifyingExportButton 
                data={mockProducts} 
                filename="products" 
                notificationType="products"
                label="Export Products"
              />
              <NotifyingExportButton 
                data={mockCustomers} 
                filename="customers" 
                notificationType="customers"
                label="Export Customers"
              />
              <NotifyingExportButton 
                data={mockMovements} 
                filename="movements" 
                notificationType="movements"
                label="Export Movements"
              />
            </div>
          </div>
          
          <div className="pt-4 border-t mt-4">
            <p className="text-sm">Import data from CSV or Excel files.</p>
            <div className="mt-2">
              <Button variant="outline">Import Data</Button>
            </div>
          </div>
          
          {currentUser?.role === 'admin' && (
            <div className="pt-4 border-t mt-4">
              <p className="text-sm text-destructive font-medium">Danger Zone</p>
              <p className="text-sm text-muted-foreground mb-2">
                The following actions cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="destructive" 
                  onClick={handleResetSystem}
                  disabled={isSubmitting}
                >
                  Reset System
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleClearAllData}
                  disabled={isSubmitting}
                >
                  Clear All Data
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
