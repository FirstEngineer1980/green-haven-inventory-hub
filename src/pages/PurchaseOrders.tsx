
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePO } from '@/context/POContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PurchaseOrder } from '@/types';
import { AddPurchaseOrderDialog } from '@/components/purchase-orders/AddPurchaseOrderDialog';
import EditPurchaseOrderDialog from '@/components/purchase-orders/EditPurchaseOrderDialog';
import { formatDate } from '@/lib/utils';

const PurchaseOrders = () => {
  const { purchaseOrders, addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } = usePO();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const { toast } = useToast();

  const handleAddPurchaseOrder = (formData: any) => {
    addPurchaseOrder({
      poNumber: formData.poNumber,
      vendorId: formData.vendorId,
      vendorName: formData.vendorName,
      status: formData.status,
      orderDate: new Date().toISOString(),
      expectedDate: formData.expectedDeliveryDate,
      total: parseFloat(formData.total),
      notes: formData.notes,
      items: formData.items || []
    });
    setShowAddDialog(false);
    toast({
      title: "Purchase Order added",
      description: "The purchase order has been added successfully",
      variant: "default",
    });
  };

  const handleUpdatePurchaseOrder = (formData: any) => {
    if (selectedPurchaseOrder) {
      updatePurchaseOrder(selectedPurchaseOrder.id, {
        poNumber: formData.poNumber,
        vendorId: formData.vendorId,
        vendorName: formData.vendorName,
        status: formData.status,
        orderDate: selectedPurchaseOrder.orderDate,
        expectedDate: formData.expectedDeliveryDate,
        total: parseFloat(formData.total),
        notes: formData.notes,
        items: formData.items || []
      });
      setShowEditDialog(false);
      setSelectedPurchaseOrder(null);
      toast({
        title: "Purchase Order updated",
        description: "The purchase order has been updated successfully",
        variant: "default",
      });
    }
  };

  const handleDeletePurchaseOrder = (id: string) => {
    deletePurchaseOrder(id);
    toast({
      title: "Purchase Order deleted",
      description: "The purchase order has been deleted successfully",
      variant: "default",
    });
  };

  const filteredPurchaseOrders = purchaseOrders.filter(po => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Purchase Order
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search purchase orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-64">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="received">Received</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>
            Manage purchase orders and track their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchaseOrders.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-medium">{po.poNumber}</TableCell>
                  <TableCell>{po.vendorName}</TableCell>
                  <TableCell>{formatDate(po.orderDate)}</TableCell>
                  <TableCell>{po.expectedDate ? formatDate(po.expectedDate) : 'N/A'}</TableCell>
                  <TableCell>{po.status}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedPurchaseOrder(po);
                        setShowEditDialog(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePurchaseOrder(po.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddPurchaseOrderDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      {selectedPurchaseOrder && (
        <EditPurchaseOrderDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          purchaseOrder={selectedPurchaseOrder}
          onSubmit={handleUpdatePurchaseOrder}
        />
      )}
    </DashboardLayout>
  );
};

export default PurchaseOrders;
