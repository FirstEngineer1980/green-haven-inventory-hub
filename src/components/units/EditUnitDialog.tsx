
import React from 'react';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UnitForm from './UnitForm';

interface EditUnitDialogProps {
  showEditDialog: boolean;
  setShowEditDialog: (show: boolean) => void;
  formData: {
    roomId: string;
    number: string;
    size: number;
    sizeUnit: 'sqft' | 'sqm' | 'm²';
    status: 'available' | 'occupied' | 'maintenance';
    description: string;
  };
  rooms: Room[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
  handleEditUnit: () => void;
}

const EditUnitDialog = ({
  showEditDialog,
  setShowEditDialog,
  formData,
  rooms,
  handleInputChange,
  handleSelectChange,
  handleEditUnit
}: EditUnitDialogProps) => {
  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Unit</DialogTitle>
          <DialogDescription>
            Update unit information.
          </DialogDescription>
        </DialogHeader>
        <UnitForm
          rooms={rooms}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditUnit}>Update Unit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUnitDialog;
