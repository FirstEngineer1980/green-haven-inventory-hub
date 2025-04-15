
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

interface EditPurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseOrder: PurchaseOrder;
}

export const EditPurchaseOrderDialog: React.FC<EditPurchaseOrderDialogProps> = ({
  open,
  onOpenChange,
  purchaseOrder
}) => {
  const { updatePurchaseOrder, vendors } = usePO();
  const { products } = useProducts();

  const onSubmit = (data: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    updatePurchaseOrder(purchaseOrder.id, data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Purchase Order</DialogTitle>
          <DialogDescription>
            Make changes to purchase order {purchaseOrder.poNumber}.
          </DialogDescription>
        </DialogHeader>
        
        <PurchaseOrderForm 
          onSubmit={onSubmit} 
          defaultValues={purchaseOrder as any} 
          vendors={vendors} 
          products={products} 
          isEditing={true}
        />
      </DialogContent>
    </Dialog>
  );
};
