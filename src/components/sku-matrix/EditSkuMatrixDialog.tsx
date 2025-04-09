
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

interface EditSkuMatrixDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unitMatrix: UnitMatrix;
}

const EditSkuMatrixDialog = ({ open, onOpenChange, unitMatrix }: EditSkuMatrixDialogProps) => {
  const { updateUnitMatrix } = useUnitMatrix();
  const { rooms } = useRooms();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: unitMatrix.name,
    roomId: unitMatrix.roomId,
  });
  
  // Reset form data when unitMatrix changes
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
      title: "SKU Matrix Updated",
      description: "The SKU matrix has been updated successfully",
      variant: "default"
    });
  };
  
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
