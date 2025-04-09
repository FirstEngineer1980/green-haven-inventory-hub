
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePO } from '@/context/POContext';
import { PurchaseOrderTable } from '@/components/purchase-orders/PurchaseOrderTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddPurchaseOrderDialog } from '@/components/purchase-orders/AddPurchaseOrderDialog';

const PurchaseOrders: React.FC = () => {
  const { purchaseOrders } = usePO();
  const [openAddDialog, setOpenAddDialog] = useState(false);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <Button onClick={() => setOpenAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" /> New PO
        </Button>
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
