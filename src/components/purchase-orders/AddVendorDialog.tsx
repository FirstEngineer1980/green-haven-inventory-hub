
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { VendorForm } from './VendorForm';
import { usePO } from '@/context/POContext';
import { Vendor } from '@/types';

interface AddVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddVendorDialog: React.FC<AddVendorDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { addVendor } = usePO();

  const onSubmit = (data: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => {
    addVendor(data);
    onOpenChange(false);
  };

  const defaultValues = {
    name: '',
    email: '',
    phone: '',
    address: '',
    contactPerson: '',
    notes: ''
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Vendor</DialogTitle>
          <DialogDescription>
            Add a new vendor to your supplier list.
          </DialogDescription>
        </DialogHeader>
        
        <VendorForm 
          onSubmit={onSubmit} 
          defaultValues={defaultValues} 
        />
      </DialogContent>
    </Dialog>
  );
};
