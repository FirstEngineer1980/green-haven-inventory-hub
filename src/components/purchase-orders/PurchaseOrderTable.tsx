
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Edit, Trash, Package } from 'lucide-react';
import { PurchaseOrder } from '@/types';
import { formatDate } from '@/lib/utils';
import { usePO } from '@/context/POContext';
import { ViewPurchaseOrderDialog } from './ViewPurchaseOrderDialog';
import { EditPurchaseOrderDialog } from './EditPurchaseOrderDialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrder[];
}

export const PurchaseOrderTable: React.FC<PurchaseOrderTableProps> = ({ purchaseOrders }) => {
  const { deletePurchaseOrder, receivePurchaseOrder } = usePO();
  const [viewPO, setViewPO] = useState<PurchaseOrder | null>(null);
  const [editPO, setEditPO] = useState<PurchaseOrder | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPOs = purchaseOrders.filter(po => 
    po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const confirmDelete = (id: string) => {
    deletePurchaseOrder(id);
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-center pb-4">
        <Input
          placeholder="Search POs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO #</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expected Delivery</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPOs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No purchase orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPOs.map(po => (
                <TableRow key={po.id}>
                  <TableCell className="font-medium">{po.poNumber}</TableCell>
                  <TableCell>{po.vendorName}</TableCell>
                  <TableCell>
                    <Badge className={`${statusColor(po.status)} text-white`}>
                      {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>${po.total.toFixed(2)}</TableCell>
                  <TableCell>{formatDate(po.createdAt)}</TableCell>
                  <TableCell>{po.expectedDeliveryDate ? formatDate(po.expectedDeliveryDate) : 'Not set'}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewPO(po)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setEditPO(po)}
                          disabled={po.status === 'received' || po.status === 'cancelled'}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => receivePurchaseOrder(po.id)}
                          disabled={po.status !== 'approved'}
                        >
                          <Package className="mr-2 h-4 w-4" />
                          Mark as Received
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setDeleteId(po.id)}
                          disabled={po.status === 'received'}
                          className="text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {viewPO && (
        <ViewPurchaseOrderDialog 
          open={!!viewPO} 
          onOpenChange={() => setViewPO(null)} 
          purchaseOrder={viewPO} 
        />
      )}

      {editPO && (
        <EditPurchaseOrderDialog 
          open={!!editPO} 
          onOpenChange={() => setEditPO(null)} 
          purchaseOrder={editPO} 
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this purchase order. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && confirmDelete(deleteId)} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
