
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { PurchaseOrderForm } from './PurchaseOrderForm';
import { usePO } from '@/context/POContext';
import { useProducts } from '@/context/ProductContext';
import { PurchaseOrder } from '@/types';

interface AddPurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddPurchaseOrderDialog: React.FC<AddPurchaseOrderDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { addPurchaseOrder, vendors } = usePO();
  const { products } = useProducts();

  const onSubmit = (data: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    addPurchaseOrder(data);
    onOpenChange(false);
  };

  // Generate a new PO number
  const generatePONumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `PO-${year}-${random}`;
  };

  const defaultValues = {
    poNumber: generatePONumber(),
    vendorId: '',
    vendorName: '',
    status: 'draft' as const,
    total: 0,
    items: []
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Order</DialogTitle>
          <DialogDescription>
            Add a new purchase order to track your inventory purchases.
          </DialogDescription>
        </DialogHeader>
        
        <PurchaseOrderForm 
          onSubmit={onSubmit} 
          defaultValues={defaultValues} 
          vendors={vendors} 
          products={products} 
        />
      </DialogContent>
    </Dialog>
  );
};
