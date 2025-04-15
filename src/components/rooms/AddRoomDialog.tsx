
import React from 'react';
import { Customer } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RoomForm from './RoomForm';

interface AddRoomDialogProps {
  open?: boolean; // Added to match usage in Rooms.tsx
  onOpenChange?: (open: boolean) => void; // Added to match usage in Rooms.tsx
  showAddDialog?: boolean; // Keep for backward compatibility
  setShowAddDialog?: (show: boolean) => void; // Keep for backward compatibility
  formData?: {
    customerId: string;
    name: string;
    unit: number;
  };
  customers?: Customer[];
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomerChange?: (value: string) => void;
  handleAddRoom?: () => void;
}

const AddRoomDialog = ({
  open,
  onOpenChange,
  showAddDialog,
  setShowAddDialog,
  formData = { customerId: '', name: '', unit: 0 },
  customers = [],
  handleInputChange = () => {},
  handleCustomerChange = () => {},
  handleAddRoom = () => {}
}: AddRoomDialogProps) => {
  // Determine which props to use based on what's provided
  const isOpen = open !== undefined ? open : showAddDialog;
  const onOpenChangeHandler = onOpenChange || setShowAddDialog;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeHandler}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
          <DialogDescription>
            Create a new room and assign it to a customer.
          </DialogDescription>
        </DialogHeader>
        <RoomForm
          customers={customers}
          formData={formData}
          handleInputChange={handleInputChange}
          handleCustomerChange={handleCustomerChange}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChangeHandler?.(false)}>Cancel</Button>
          <Button onClick={handleAddRoom}>Add Room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoomDialog;
