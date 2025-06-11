
import React, { useState, useEffect } from 'react';
import { useUnitMatrix } from '@/context/UnitMatrixContext';
import { useRooms } from '@/context/RoomContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UnitMatrix } from '@/types';
import { Plus, X } from 'lucide-react';

interface EditSkuMatrixDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unitMatrix: UnitMatrix;
}

const EditSkuMatrixDialog = ({ open, onOpenChange, unitMatrix }: EditSkuMatrixDialogProps) => {
  const { updateUnitMatrix, addRow, columns } = useUnitMatrix();
  const { rooms } = useRooms();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: unitMatrix.name,
    roomId: unitMatrix.roomId || '',
  });
  
  const [newRows, setNewRows] = useState<{ label: string; color: string; }[]>([]);
  const [newRowLabel, setNewRowLabel] = useState('');
  const [newRowColor, setNewRowColor] = useState('#FFFFFF');
  
  // Reset form data when unitMatrix changes
  useEffect(() => {
    setFormData({
      name: unitMatrix.name,
      roomId: unitMatrix.roomId || '',
    });
    setNewRows([]);
  }, [unitMatrix]);
  
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
    
    setNewRows(prev => [...prev, { label: newRowLabel, color: newRowColor }]);
    setNewRowLabel('');
    setNewRowColor('#FFFFFF');
  };
  
  const handleRemoveNewRow = (index: number) => {
    setNewRows(prev => prev.filter((_, i) => i !== index));
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
    
    // First update the basic info
    updateUnitMatrix(unitMatrix.id, {
      name: formData.name,
      roomId: formData.roomId,
    });
    
    // Then add any new rows
    if (newRows.length > 0) {
      // Add the new rows one by one
      newRows.forEach(row => {
        addRow(unitMatrix.id, row.label, row.color);
      });
    }
    
    onOpenChange(false);
    
    toast({
      title: "SKU Matrix Updated",
      description: "The SKU matrix has been updated successfully",
      variant: "default"
    });
  };

  // Filter rooms to ensure they have valid IDs (not empty strings or null/undefined)
  const validRooms = rooms.filter(room => room.id && room.id.trim() !== '');
  
  // Ensure the current roomId is valid, if not set to placeholder value
  const currentRoomId = formData.roomId && formData.roomId.trim() !== '' ? formData.roomId : 'no-room-selected';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit SKU Matrix</DialogTitle>
          <DialogDescription>
            Update the SKU matrix details.
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
              value={currentRoomId}
              onValueChange={(value) => handleSelectChange('roomId', value === 'no-room-selected' ? '' : value)}
            >
              <SelectTrigger id="roomId">
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-room-selected">No room selected</SelectItem>
                {validRooms.length > 0 ? (
                  validRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))
                ) : null}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Add New Rows</Label>
            <div className="border rounded-md p-2 bg-gray-50">
              {newRows.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {newRows.map((row, index) => (
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
                        onClick={() => handleRemoveNewRow(index)}
                        className="ml-auto"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-2">
                  No new rows to add
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
          <Button onClick={handleSubmit}>Update SKU Matrix</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSkuMatrixDialog;
