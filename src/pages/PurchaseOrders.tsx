
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePO } from '@/context/POContext';
import { PurchaseOrderTable } from '@/components/purchase-orders/PurchaseOrderTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddPurchaseOrderDialog } from '@/components/purchase-orders/AddPurchaseOrderDialog';
import { useToast } from '@/hooks/use-toast';
import ExportButton from '@/components/shared/ExportButton';
import ImportButton from '@/components/shared/ImportButton';
import { getTemplateUrl, validateTemplate } from '@/utils/templateGenerator';

const PurchaseOrders: React.FC = () => {
  const { purchaseOrders, addPurchaseOrder } = usePO();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const { toast } = useToast();
  
  const handlePOImport = (data: any[]) => {
    try {
      data.forEach(poData => {
        const purchaseOrder = {
          poNumber: poData.poNumber,
          vendorId: poData.vendorId,
          vendorName: poData.vendorName || 'Unknown Vendor', // This will be updated by the context
          status: poData.status,
          total: poData.total,
          expectedDeliveryDate: poData.expectedDeliveryDate,
          notes: poData.notes,
          items: poData.items || []
        };
        addPurchaseOrder(purchaseOrder);
      });
      
      toast({
        title: "Purchase Orders imported",
        description: `${data.length} purchase orders have been imported successfully`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error importing purchase orders:', error);
      toast({
        title: "Import failed",
        description: "An error occurred while importing purchase orders",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <div className="flex gap-2">
          <ImportButton 
            onImport={handlePOImport} 
            templateUrl={getTemplateUrl('purchaseOrders')}
            validationFn={(data) => validateTemplate(data, 'purchaseOrders')}
          />
          <ExportButton 
            data={purchaseOrders} 
            filename="purchase_orders" 
            fields={['id', 'poNumber', 'vendorId', 'vendorName', 'status', 'total', 'createdAt', 'updatedAt', 'expectedDeliveryDate', 'notes', 'items']}
          />
          <Button onClick={() => setOpenAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" /> New PO
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>
            Manage your purchase orders and vendor relationships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PurchaseOrderTable purchaseOrders={purchaseOrders} />
        </CardContent>
      </Card>

      <AddPurchaseOrderDialog open={openAddDialog} onOpenChange={setOpenAddDialog} />
    </DashboardLayout>
  );
};

export default PurchaseOrders;
