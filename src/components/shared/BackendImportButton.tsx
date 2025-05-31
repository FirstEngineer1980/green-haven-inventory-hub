
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiInstance } from '@/api/services/api';

interface BackendImportButtonProps {
  type: string;
  onSuccess: () => void;
}

const BackendImportButton: React.FC<BackendImportButtonProps> = ({ type, onSuccess }) => {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const formData = new FormData();
      formData.append('file', file);

      await apiInstance.post(`/import/${type}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: "Import successful",
        description: `${type} data has been imported successfully`,
        variant: "default",
      });

      onSuccess();
    } catch (error: any) {
      console.error('Import error:', error);
      const errorMessage = error.response?.data?.message || 'Import failed';
      toast({
        title: "Import failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".xlsx,.xls,.csv"
        style={{ display: 'none' }}
      />
      <Button 
        variant="outline" 
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
      >
        <Upload className="mr-2 h-4 w-4" />
        {isImporting ? 'Importing...' : 'Import'}
      </Button>
    </>
  );
};

export default BackendImportButton;
