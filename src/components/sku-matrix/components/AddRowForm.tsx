
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

interface AddRowFormProps {
  onAddRow: (label: string, color: string) => void;
}

const AddRowForm = ({ onAddRow }: AddRowFormProps) => {
  const [newRowLabel, setNewRowLabel] = useState('');
  const [newRowColor, setNewRowColor] = useState('#3B82F6'); // Default to a nice blue
  const { toast } = useToast();

  const handleAddRow = () => {
    if (!newRowLabel.trim()) {
      toast({
        title: "Validation Error",
        description: "Row label is required",
        variant: "destructive"
      });
      return;
    }
    
    onAddRow(newRowLabel, newRowColor);
    setNewRowLabel('');
    // Don't reset the color so users can add multiple rows of the same color
  };

  return (
    <div className="space-y-3 p-3 border rounded-md bg-muted/30">
      <div className="text-sm font-medium">Add New Row</div>
      <div className="grid gap-2">
        <Label htmlFor="rowLabel">Row Label</Label>
        <Input
          id="rowLabel"
          placeholder="Enter row name (e.g., Shelf 1)"
          value={newRowLabel}
          onChange={(e) => setNewRowLabel(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="rowColor">Row Color</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="rowColor"
            type="color"
            value={newRowColor}
            onChange={(e) => setNewRowColor(e.target.value)}
            className="w-16 h-8"
          />
          <div 
            className="w-8 h-8 rounded-md border"
            style={{ backgroundColor: newRowColor }}
          ></div>
        </div>
      </div>
      <Button onClick={handleAddRow} type="button" className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Row
      </Button>
    </div>
  );
};

export default AddRowForm;
