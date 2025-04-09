
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { PurchaseOrder } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { usePO } from '@/context/POContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Package, Printer } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface ViewPurchaseOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseOrder: PurchaseOrder;
}

export const ViewPurchaseOrderDialog: React.FC<ViewPurchaseOrderDialogProps> = ({
  open,
  onOpenChange,
  purchaseOrder
}) => {
  const { receivePurchaseOrder, getVendor } = usePO();
  
  const vendor = getVendor(purchaseOrder.vendorId);
  
  const statusColor = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'received': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const handleReceive = () => {
    receivePurchaseOrder(purchaseOrder.id);
    onOpenChange(false);
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl">Purchase Order: {purchaseOrder.poNumber}</DialogTitle>
            <Badge className={`${statusColor(purchaseOrder.status)} text-white px-3 py-1`}>
              {purchaseOrder.status.charAt(0).toUpperCase() + purchaseOrder.status.slice(1)}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Vendor Information</h3>
              <p>{purchaseOrder.vendorName}</p>
              {vendor && (
                <>
                  <p>{vendor.contactPerson}</p>
                  <p>{vendor.email}</p>
                  <p>{vendor.phone}</p>
                  <p>{vendor.address}</p>
                </>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold">Order Information</h3>
              <p><span className="font-medium">Created:</span> {formatDate(purchaseOrder.createdAt)}</p>
              <p><span className="font-medium">Last Updated:</span> {formatDate(purchaseOrder.updatedAt)}</p>
              {purchaseOrder.expectedDeliveryDate && (
                <p><span className="font-medium">Expected Delivery:</span> {formatDate(purchaseOrder.expectedDeliveryDate)}</p>
              )}
              {purchaseOrder.notes && (
                <p><span className="font-medium">Notes:</span> {purchaseOrder.notes}</p>
              )}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchaseOrder.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">Order Total:</TableCell>
                    <TableCell className="text-right font-bold">${purchaseOrder.total.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            onClick={handlePrint}
            className="mr-2"
          >
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          {purchaseOrder.status === 'approved' && (
            <Button 
              onClick={handleReceive}
              className="bg-green-600 hover:bg-green-700"
            >
              <Package className="w-4 h-4 mr-2" /> Mark as Received
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
