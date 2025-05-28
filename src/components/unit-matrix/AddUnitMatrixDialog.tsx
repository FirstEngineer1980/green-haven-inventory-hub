import React, { useState } from 'react';
import { useUnitMatrix } from '@/context/UnitMatrixContext';
import { useRooms } from '@/context/RoomContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddUnitMatrixDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddUnitMatrixDialog = ({ open, onOpenChange }: AddUnitMatrixDialogProps) => {
  const { addUnitMatrix } = useUnitMatrix();
  const { rooms } = useRooms();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    roomId: '',
  });
  
  const [rows, setRows] = useState<{ label: string; color: string; }[]>([]);
  const [newRowLabel, setNewRowLabel] = useState('');
  const [newRowColor, setNewRowColor] = useState('#FFFFFF');
  
  const [columns, setColumns] = useState<{ id: string; name: string; }[]>([]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddRow = () => {
    if (!newRowLabel.trim()) {
      toast({
        title: "Validation Error",
        description: "Row label is required",
        variant: "destructive"
      });
      return;
    }
    
    setRows(prev => [...prev, { label: newRowLabel, color: newRowColor }]);
    setNewRowLabel('');
    setNewRowColor('#FFFFFF');
  };
  
  const handleRemoveRow = (index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = () => {
    if (!formData.name || !formData.roomId) {
      toast({
        title: "Validation Error",
        description: "Matrix name and room are required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (rows.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one row is required",
        variant: "destructive"
      });
      return;
    }
    
    // Add IDs to rows and create cells for each row
    const timestamp = Date.now();
    const rowsWithIds = rows.map((row, index) => {
      const rowId = `row-${timestamp}-${index}`;
      
      // Create cells for each column in this row
      const cellsForRow = columns.map(column => ({
        id: `${rowId}-${column.id}`,
        columnId: column.id,
        value: '',
        content: ''
      }));
      
      return {
        id: rowId,
        name: row.label, // Add the missing name property
        label: row.label,
        color: row.color,
        cells: cellsForRow
      };
    });
    
    addUnitMatrix({
      name: formData.name,
      roomId: formData.roomId,
      description: '',
      rows: rowsWithIds,
    });
    
    // Reset form
    setFormData({ name: '', roomId: '' });
    setRows([]);
    onOpenChange(false);
    
    toast({
      title: "Unit Matrix Added",
      description: "The new unit matrix has been created successfully",
      variant: "default"
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Unit Matrix</DialogTitle>
          <DialogDescription>
            Create a new unit matrix and assign it to a room.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Matrix Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter matrix name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="roomId">Room</Label>
            <Select
              value={formData.roomId}
              onValueChange={(value) => handleSelectChange('roomId', value)}
            >
              <SelectTrigger id="roomId">
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Rows</Label>
            <div className="border rounded-md p-2 bg-gray-50">
              {rows.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {rows.map((row, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-md"
                        style={{ backgroundColor: row.color }}
                      ></div>
                      <span>{row.label}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRow(index)}
                        className="ml-auto"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-2">
                  No rows added
                </div>
              )}
              
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
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Unit Matrix</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUnitMatrixDialog;
