
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

interface AddBinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unitMatrixId?: string;
}

export const AddBinDialog: React.FC<AddBinDialogProps> = ({
  open,
  onOpenChange,
  unitMatrixId
}) => {
  const { addBin } = useBins();

  const handleSubmit = (data: Partial<Bin>) => {
    // If unitMatrixId is provided as a prop, use it as the default
    const binData = unitMatrixId 
      ? { ...data, unitMatrixId } 
      : data;
      
    addBin(binData as any);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Bin</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new bin.
          </DialogDescription>
        </DialogHeader>
        
        <BinForm 
          onSubmit={handleSubmit} 
          defaultValues={unitMatrixId ? { unitMatrixId } : {}}
        />
      </DialogContent>
    </Dialog>
  );
};
