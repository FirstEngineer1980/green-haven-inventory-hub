
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
  skuMatrixId?: string;
}

export const AddBinDialog: React.FC<AddBinDialogProps> = ({
  open,
  onOpenChange,
  skuMatrixId
}) => {
  const { addBin } = useBins();

  const handleSubmit = (data: Partial<Bin>) => {
    // If skuMatrixId is provided as a prop, use it as the default
    const binData = skuMatrixId 
      ? { ...data, skuMatrixId } 
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
          defaultValues={skuMatrixId ? { skuMatrixId } : {}}
        />
      </DialogContent>
    </Dialog>
  );
};
