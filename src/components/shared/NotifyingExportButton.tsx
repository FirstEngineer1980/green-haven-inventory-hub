
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

interface NotifyingExportButtonProps {
  data: any[];
  filename: string;
  fields?: string[];
  label?: string;
  notificationType: 'products' | 'customers' | 'movements' | 'users' | 'other';
}

const NotifyingExportButton: React.FC<NotifyingExportButtonProps> = ({ 
  data, 
  filename, 
  fields,
  label = "Export",
  notificationType
}) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();

  const handleExport = async () => {
    if (!data || data.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no data available to export.",
        variant: "destructive",
      });
      return;
    }

    try {
      // If fields are specified, only export those fields
      const exportData = fields 
        ? data.map(item => {
            const filteredItem: Record<string, any> = {};
            fields.forEach(field => {
              filteredItem[field] = item[field];
            });
            return filteredItem;
          })
        : data;

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      const exportFilename = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
      link.download = exportFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Notify server about the export
      await axios.post('/api/export-notifications', {
        type: notificationType,
        filename: exportFilename,
        exportedBy: currentUser?.id,
        exportedAt: new Date().toISOString(),
        recordCount: data.length
      });

      toast({
        title: "Export successful",
        description: `Data has been exported to ${link.download}`,
        variant: "default",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "An error occurred while exporting the data.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      {label}
    </Button>
  );
};

export default NotifyingExportButton;
