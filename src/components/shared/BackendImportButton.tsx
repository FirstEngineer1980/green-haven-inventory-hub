
import React, { useState } from 'react';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { exportImportService } from '@/api/services/exportImportService';
import * as XLSX from 'xlsx';

interface BackendImportButtonProps {
  type: string;
  onSuccess?: () => void;
  label?: string;
}

const BackendImportButton: React.FC<BackendImportButtonProps> = ({ 
  type, 
  onSuccess,
  label = "Import"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [overwrite, setOverwrite] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validTypes = [
        'application/json',
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      
      if (!validTypes.includes(selectedFile.type)) {
        setErrors(['Please upload a valid JSON, CSV, or Excel file']);
        return;
      }
      
      setFile(selectedFile);
      setErrors([]);
    }
  };

  const parseFile = async (file: File): Promise<any[]> => {
    if (file.type === 'application/json') {
      const content = await file.text();
      return JSON.parse(content);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } catch (error) {
          reject(new Error('Failed to parse file'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  };

  const handleImport = async () => {
    if (!file) {
      setErrors(['Please select a file to import']);
      return;
    }

    setIsLoading(true);
    setErrors([]);

    try {
      const data = await parseFile(file);
      
      const result = await exportImportService.importData(type, data, { overwrite });

      toast({
        title: "Import completed",
        description: `${result.imported_count} items imported, ${result.updated_count} items updated`,
        variant: "default",
      });

      if (result.errors && result.errors.length > 0) {
        setErrors(result.errors);
      } else {
        setIsOpen(false);
        onSuccess?.();
      }
    } catch (error: any) {
      console.error('Import error:', error);
      setErrors([error.response?.data?.error || 'Failed to import data']);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setOverwrite(false);
    setErrors([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import {type}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select File</label>
            <input
              type="file"
              accept=".json,.csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-violet-50 file:text-violet-700
                       hover:file:bg-violet-100"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="overwrite"
              checked={overwrite}
              onCheckedChange={(checked) => setOverwrite(checked as boolean)}
            />
            <label htmlFor="overwrite" className="text-sm">
              Overwrite existing records
            </label>
          </div>

          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BackendImportButton;
