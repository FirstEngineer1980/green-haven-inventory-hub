
import React, { useState } from 'react';
import { useCustomerProducts, CustomerProduct } from '@/context/CustomerProductContext';
import { useCustomers } from '@/context/CustomerContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
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
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface CustomerProductTableProps {
  customerIdFilter?: string;
  onEdit: (product: CustomerProduct) => void;
}

const CustomerProductTable: React.FC<CustomerProductTableProps> = ({ customerIdFilter, onEdit }) => {
  const { customerProducts, deleteCustomerProduct } = useCustomerProducts();
  const { customers } = useCustomers();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CustomerProduct | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  
  // Filter products based on customer ID if provided
  const products = customerIdFilter
    ? customerProducts.filter(product => product.customerId === customerIdFilter)
    : customerProducts;
  
  const canEdit = user?.permissions?.includes('manage_products') || user?.role === 'admin';
  
  const handleEdit = (product: CustomerProduct) => {
    onEdit(product);
  };
  
  const handleDelete = (product: CustomerProduct) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedProduct) {
      deleteCustomerProduct(selectedProduct.id);
      addNotification({
        title: 'Product Deleted',
        message: `${selectedProduct.name} has been deleted successfully.`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
      setDeleteDialogOpen(false);
    }
  };
  
  const handlePreview = (product: CustomerProduct) => {
    setSelectedProduct(product);
    setPreviewDialogOpen(true);
  };
  
  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown Customer';
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">SKU</TableHead>
              <TableHead className="w-[80px] text-center">QTY</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Picture</TableHead>
              <TableHead>Description</TableHead>
              {!customerIdFilter && <TableHead>Customer</TableHead>}
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={customerIdFilter ? 6 : 7} className="text-center h-24 text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map(product => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell className="text-center">{product.qty}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    {product.picture ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={product.picture} alt={product.name} />
                        <AvatarFallback>{product.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{product.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate">{product.description || 'No description'}</TableCell>
                  {!customerIdFilter && (
                    <TableCell>{getCustomerName(product.customerId)}</TableCell>
                  )}
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handlePreview(product)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {canEdit && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(product)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              Detailed information about the product.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {selectedProduct?.picture && (
              <div className="flex justify-center">
                <img 
                  src={selectedProduct.picture} 
                  alt={selectedProduct.name} 
                  className="h-48 object-contain rounded-md"
                />
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">SKU</h4>
                <p>{selectedProduct?.sku}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Quantity</h4>
                <p>{selectedProduct?.qty}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Name</h4>
              <p className="font-medium">{selectedProduct?.name}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
              <p>{selectedProduct?.description || 'No description'}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground">Customer</h4>
              <p>{selectedProduct ? getCustomerName(selectedProduct.customerId) : ''}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Created</h4>
                <p>{selectedProduct ? new Date(selectedProduct.createdAt).toLocaleDateString() : ''}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground">Updated</h4>
                <p>{selectedProduct ? new Date(selectedProduct.updatedAt).toLocaleDateString() : ''}</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomerProductTable;
