
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { BinForm } from './BinForm';
import { useBins } from '@/context/BinContext';
import { Bin } from '@/types';

interface EditBinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bin: Bin;
}

export const EditBinDialog: React.FC<EditBinDialogProps> = ({
  open,
  onOpenChange,
  bin
}) => {
  const { updateBin } = useBins();

  const handleSubmit = (data: Omit<Bin, 'id' | 'volumeCapacity' | 'unitMatrixName' | 'createdAt' | 'updatedAt'>) => {
    updateBin(bin.id, data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bin</DialogTitle>
          <DialogDescription>
            Update bin information for {bin.name}.
          </DialogDescription>
        </DialogHeader>
        
        <BinForm 
          onSubmit={handleSubmit} 
          defaultValues={bin} 
          isEditing={true}
        />
      </DialogContent>
    </Dialog>
  );
};
