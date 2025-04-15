
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface ImportButtonProps {
  onImport: (data: any[]) => void;
  label?: string;
  templateUrl?: string;
  validationFn?: (data: any[]) => { valid: boolean; errors?: string[] };
}

const ImportButton: React.FC<ImportButtonProps> = ({ 
  onImport, 
  label = "Import", 
  templateUrl,
  validationFn
}) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
      
      // Validate the data if a validation function is provided
      if (validationFn) {
        const validation = validationFn(data);
        if (!validation.valid) {
          setErrors(validation.errors || ['Invalid data format']);
          setIsLoading(false);
          return;
        }
      }

      onImport(data);
      setOpen(false);
      toast({
        title: "Import successful",
        description: `${Array.isArray(data) ? data.length : 0} items imported successfully`,
        variant: "default",
      });
    } catch (error) {
      console.error('Import error:', error);
      setErrors(['Failed to parse file. Please ensure the file format is correct']);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    if (templateUrl) {
      window.open(templateUrl, '_blank');
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Upload className="mr-2 h-4 w-4" />
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              Upload a JSON, CSV, or Excel file with the data you want to import.
              {templateUrl && (
                <div className="mt-2">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-500" 
                    onClick={downloadTemplate}
                  >
                    Download template
                  </Button>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
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
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!file || isLoading}>
              {isLoading ? 'Importing...' : 'Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImportButton;
