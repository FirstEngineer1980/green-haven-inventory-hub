
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddRowFormProps {
  onAddRow: (label: string, color: string) => void;
}

const AddRowForm = ({ onAddRow }: AddRowFormProps) => {
  const [newRowLabel, setNewRowLabel] = useState('');
  const [newRowColor, setNewRowColor] = useState('#FFFFFF');
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
    setNewRowColor('#FFFFFF');
  };

  return (
    <div className="flex space-x-2">
      <Input
        placeholder="Row Label"
        value={newRowLabel}
        onChange={(e) => setNewRowLabel(e.target.value)}
        className="flex-1"
      />
      <Input
        type="color"
        value={newRowColor}
        onChange={(e) => setNewRowColor(e.target.value)}
        className="w-16"
      />
      <Button onClick={handleAddRow} type="button" size="sm">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AddRowForm;
