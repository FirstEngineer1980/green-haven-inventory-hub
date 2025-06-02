
import React, { useState, useEffect } from 'react';
import { UnitMatrix } from '@/types';
import { useUnitMatrix } from '@/context/UnitMatrixContext';
import { useRooms } from '@/context/RoomContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface EditUnitMatrixDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unitMatrix: UnitMatrix;
}

const EditUnitMatrixDialog = ({ open, onOpenChange, unitMatrix }: EditUnitMatrixDialogProps) => {
  const { updateUnitMatrix } = useUnitMatrix();
  const { rooms } = useRooms();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: unitMatrix.name,
    roomId: unitMatrix.roomId,
  });
  
  // Update formData if the unitMatrix prop changes
  useEffect(() => {
    setFormData({
      name: unitMatrix.name,
      roomId: unitMatrix.roomId,
    });
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
  
  const handleSubmit = () => {
    if (!formData.name || !formData.roomId) {
      toast({
        title: "Validation Error",
        description: "Matrix name and room are required fields",
        variant: "destructive"
      });
      return;
    }
    
    updateUnitMatrix(unitMatrix.id, {
      name: formData.name,
      roomId: formData.roomId,
    });
    
    onOpenChange(false);
    
    toast({
      title: "Unit Matrix Updated",
      description: "The unit matrix has been updated successfully",
      variant: "default"
    });
  };

  // Filter rooms to ensure they have valid IDs (not empty strings or null/undefined)
  const validRooms = rooms.filter(room => room.id && room.id.trim() !== '');
  
  // Ensure the current roomId is valid, if not set to empty string for placeholder
  const currentRoomId = formData.roomId && formData.roomId.trim() !== '' ? formData.roomId : '';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Unit Matrix</DialogTitle>
          <DialogDescription>
            Update the unit matrix details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Matrix Name</Label>
            <Input
              id="edit-name"
              name="name"
              placeholder="Enter matrix name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-roomId">Room</Label>
            <Select
              value={currentRoomId}
              onValueChange={(value) => handleSelectChange('roomId', value)}
            >
              <SelectTrigger id="edit-roomId">
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {validRooms.length > 0 ? (
                  validRooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-rooms-available" disabled>
                    No rooms available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              To edit rows, columns, and cell values, use the edit button on the matrix table.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Update Unit Matrix</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUnitMatrixDialog;
