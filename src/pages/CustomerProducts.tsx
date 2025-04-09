
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import CustomerProductTable from '@/components/customer-products/CustomerProductTable';
import CustomerProductForm from '@/components/customer-products/CustomerProductForm';
import { useCustomerProducts, CustomerProduct } from '@/context/CustomerProductContext';
import { useCustomers } from '@/context/CustomerContext';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const CustomerProducts = () => {
  const { addCustomerProduct, updateCustomerProduct } = useCustomerProducts();
  const { customers } = useCustomers();
  const { addNotification } = useNotifications();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CustomerProduct | undefined>(undefined);
  
  const handleAddNew = () => {
    setEditingProduct(undefined);
    setFormOpen(true);
  };
  
  const handleEdit = (product: CustomerProduct) => {
    setEditingProduct(product);
    setFormOpen(true);
  };
  
  const handleFormSubmit = (values: any) => {
    if (editingProduct) {
      // Update existing product
      updateCustomerProduct(editingProduct.id, values);
      addNotification({
        title: 'Product Updated',
        message: `${values.name} has been updated successfully.`,
        type: 'success',
        for: ['1', '2'], // Admin, Manager
      });
    } else {
      // Add new product
      addCustomerProduct(values);
      addNotification({
        title: 'Product Added',
        message: `${values.name} has been added successfully.`,
        type: 'success',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCustomerId('');
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Customer Products</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="grid w-full max-w-sm">
                <Input
                  placeholder="Search by name or SKU"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="grid w-full max-w-sm">
                <Select
                  value={selectedCustomerId}
                  onValueChange={setSelectedCustomerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Customers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Customers</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" onClick={resetFilters}>
                <RefreshCw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <CustomerProductTable 
          customerIdFilter={selectedCustomerId} 
          onEdit={handleEdit} 
        />
        
        <CustomerProductForm
          open={formOpen}
          onOpenChange={setFormOpen}
          product={editingProduct}
          onSubmit={handleFormSubmit}
          title={editingProduct ? 'Edit Customer Product' : 'Add Customer Product'}
        />
      </div>
    </DashboardLayout>
  );
};

export default CustomerProducts;
