
import React from 'react';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import UnitForm from './UnitForm';

interface AddUnitDialogProps {
  showAddDialog: boolean;
  setShowAddDialog: (show: boolean) => void;
  formData: {
    name: string;
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
  handleAddUnit: () => void;
}

const AddUnitDialog = ({
  showAddDialog,
  setShowAddDialog,
  formData,
  rooms,
  handleInputChange,
  handleSelectChange,
  handleAddUnit
}: AddUnitDialogProps) => {
  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Unit</DialogTitle>
          <DialogDescription>
            Create a new unit and assign it to a room.
          </DialogDescription>
        </DialogHeader>
        <UnitForm
          rooms={rooms}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
          <Button onClick={handleAddUnit}>Add Unit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUnitDialog;
