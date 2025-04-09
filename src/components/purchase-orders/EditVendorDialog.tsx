
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

interface EditVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: Vendor;
}

export const EditVendorDialog: React.FC<EditVendorDialogProps> = ({
  open,
  onOpenChange,
  vendor
}) => {
  const { updateVendor } = usePO();

  const onSubmit = (data: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>) => {
    updateVendor(vendor.id, data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Vendor</DialogTitle>
          <DialogDescription>
            Update vendor information for {vendor.name}.
          </DialogDescription>
        </DialogHeader>
        
        <VendorForm 
          onSubmit={onSubmit} 
          defaultValues={vendor} 
          isEditing={true}
        />
      </DialogContent>
    </Dialog>
  );
};
