
import React from 'react';
import { Customer } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import RoomForm from './RoomForm';

interface EditRoomDialogProps {
  showEditDialog: boolean;
  setShowEditDialog: (show: boolean) => void;
  formData: {
    customerId: string;
    name: string;
    unit: number;
  };
  customers: Customer[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomerChange: (value: string) => void;
  handleEditRoom: () => void;
}

const EditRoomDialog = ({
  showEditDialog,
  setShowEditDialog,
  formData,
  customers,
  handleInputChange,
  handleCustomerChange,
  handleEditRoom
}: EditRoomDialogProps) => {
  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
          <DialogDescription>
            Update room details for this customer.
          </DialogDescription>
        </DialogHeader>
        <RoomForm
          customers={customers}
          formData={formData}
          handleInputChange={handleInputChange}
          handleCustomerChange={handleCustomerChange}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditRoom}>Update Room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRoomDialog;
