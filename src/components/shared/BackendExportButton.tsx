
import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { exportImportService } from '@/api/services/exportImportService';

interface BackendExportButtonProps {
  type: string;
  availableFields?: string[];
  label?: string;
}

const BackendExportButton: React.FC<BackendExportButtonProps> = ({ 
  type, 
  availableFields = [],
  label = "Export"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const { toast } = useToast();

  const handleExport = async () => {
    setIsLoading(true);
    try {
      const options = {
        format,
        ...(selectedFields.length > 0 && { fields: selectedFields }),
      };

      const result = await exportImportService.exportData(type, options);
      
      if (format === 'json') {
        await exportImportService.downloadExport(
          type, 
          `${type}_export_${new Date().toISOString().split('T')[0]}.json`,
          result.data
        );
      }

      toast({
        title: "Export successful",
        description: `${result.count} records exported successfully`,
        variant: "default",
      });

      setIsOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "An error occurred while exporting the data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export {type}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">Format</label>
            <Select value={format} onValueChange={(value: 'json' | 'csv') => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {availableFields.length > 0 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Fields to Export (leave empty for all)</label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {availableFields.map((field) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Checkbox
                      id={field}
                      checked={selectedFields.includes(field)}
                      onCheckedChange={() => handleFieldToggle(field)}
                    />
                    <label htmlFor={field} className="text-sm">{field}</label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BackendExportButton;
