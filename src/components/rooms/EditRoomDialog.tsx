
import React from 'react';
import { Customer, Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RoomForm from './RoomForm';

interface EditRoomDialogProps {
  open?: boolean; // Added to match usage in Rooms.tsx
  onOpenChange?: (open: boolean) => void; // Added to match usage in Rooms.tsx
  room?: Room; // Added to match usage in Rooms.tsx
  showEditDialog?: boolean; // Keep for backward compatibility
  setShowEditDialog?: (show: boolean) => void; // Keep for backward compatibility
  formData?: {
    customerId: string;
    name: string;
    unit: number;
  };
  customers?: Customer[];
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomerChange?: (value: string) => void;
  handleEditRoom?: () => void;
}

const EditRoomDialog = ({
  open,
  onOpenChange,
  room,
  showEditDialog,
  setShowEditDialog,
  formData = { customerId: '', name: '', unit: 0 },
  customers = [],
  handleInputChange = () => {},
  handleCustomerChange = () => {},
  handleEditRoom = () => {}
}: EditRoomDialogProps) => {
  // If room is provided and formData isn't explicitly set, create formData from room
  const actualFormData = formData.name ? formData : room ? {
    customerId: room.customerId || '',
    name: room.name,
    unit: parseInt(room.unit || '0')
  } : formData;
  
  // Determine which props to use based on what's provided
  const isOpen = open !== undefined ? open : showEditDialog;
  const onOpenChangeHandler = onOpenChange || setShowEditDialog;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChangeHandler}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
          <DialogDescription>
            Update room details for this customer.
          </DialogDescription>
        </DialogHeader>
        <RoomForm
          customers={customers}
          formData={actualFormData}
          handleInputChange={handleInputChange}
          handleCustomerChange={handleCustomerChange}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChangeHandler?.(false)}>Cancel</Button>
          <Button onClick={handleEditRoom}>Update Room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoomDialog;
