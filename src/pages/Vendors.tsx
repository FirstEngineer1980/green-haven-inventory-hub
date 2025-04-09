
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePO } from '@/context/POContext';
import { VendorTable } from '@/components/purchase-orders/VendorTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddVendorDialog } from '@/components/purchase-orders/AddVendorDialog';

const Vendors: React.FC = () => {
  const { vendors } = usePO();
  const [openAddDialog, setOpenAddDialog] = useState(false);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Vendors</h1>
        <Button onClick={() => setOpenAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" /> New Vendor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendors</CardTitle>
          <CardDescription>
            Manage your suppliers and vendor relationships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VendorTable vendors={vendors} />
        </CardContent>
      </Card>

      <AddVendorDialog open={openAddDialog} onOpenChange={setOpenAddDialog} />
    </DashboardLayout>
  );
};

export default Vendors;
