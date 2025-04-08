
import React from 'react';
import { Customer } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RoomForm from './RoomForm';

interface AddRoomDialogProps {
  showAddDialog: boolean;
  setShowAddDialog: (show: boolean) => void;
  formData: {
    customerId: string;
    name: string;
    unit: number;
  };
  customers: Customer[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomerChange: (value: string) => void;
  handleAddRoom: () => void;
}

const AddRoomDialog = ({
  showAddDialog,
  setShowAddDialog,
  formData,
  customers,
  handleInputChange,
  handleCustomerChange,
  handleAddRoom
}: AddRoomDialogProps) => {
  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
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
          <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddRoom}>Add Room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoomDialog;
