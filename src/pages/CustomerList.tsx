
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCustomers } from '@/context/CustomerContext';
import { useCustomerProducts, CustomerProduct } from '@/context/CustomerProductContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building, Plus, Check } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import CustomerProductTable from '@/components/customer-products/CustomerProductTable';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const CustomerList = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { customers } = useCustomers();
  const { customerProducts, addCustomerProduct } = useCustomerProducts();
  const { toast } = useToast();
  
  const customer = customers.find(c => c.id === customerId);
  const [showNewLine, setShowNewLine] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<CustomerProduct>>({
    customerId: customerId || '',
    sku: '',
    name: '',
    qty: 1,
    description: ''
  });
  
  // State for custom SKU input
  const [customSkuValue, setCustomSkuValue] = useState('');
  
  // Get all existing SKUs for dropdown
  const availableSkus = [...new Set(customerProducts.map(product => product.sku))];
  
  const handleAddNewLine = () => {
    setShowNewLine(true);
  };
  
  const handleSaveLine = () => {
    if (!newProduct.sku || !newProduct.name) {
      toast({
        title: "Missing information",
        description: "Please fill out at least the SKU and name fields",
        variant: "destructive"
      });
      return;
    }
    
    // Use custom SKU if selected
    const finalSku = newProduct.sku === 'custom' ? customSkuValue : newProduct.sku;
    
    addCustomerProduct({
      sku: finalSku,
      name: newProduct.name,
      qty: newProduct.qty || 1,
      description: newProduct.description || '',
      customerId: customerId || '',
      customer_id: customerId || ''
    });
    
    // Reset form
    setNewProduct({
      customerId: customerId || '',
      sku: '',
      name: '',
      qty: 1,
      description: ''
    });
    setCustomSkuValue('');
    setShowNewLine(false);
    
    toast({
      title: "Product Added",
      description: "New product line has been added successfully.",
      variant: "default"
    });
  };
  
  const handleChange = (field: string, value: string | number) => {
    setNewProduct(prev => ({ ...prev, [field]: value }));
  };
  
  if (!customer) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Button variant="ghost" onClick={() => navigate('/customers')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Button>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Customer not found</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/customers')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Customer List</h1>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                {customer.company ? (
                  <Building className="h-5 w-5 text-primary" />
                ) : (
                  <span className="text-primary font-medium">{customer.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <CardTitle>{customer.name}</CardTitle>
                <CardDescription>{customer.company || 'Individual Customer'}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{customer.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p>{customer.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Customer Since</p>
                <p>{new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Customer Products</h3>
              <Button size="sm" onClick={handleAddNewLine}>
                <Plus className="h-4 w-4 mr-2" />
                Add Line
              </Button>
            </div>
            
            {showNewLine && (
              <div className="mb-4 p-4 border rounded-md bg-muted/10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
                  <div>
                    <Select
                      value={newProduct.sku}
                      onValueChange={(value) => handleChange('sku', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select SKU" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSkus.map((sku) => (
                          <SelectItem key={sku} value={sku}>{sku}</SelectItem>
                        ))}
                        <SelectItem value="custom">Custom SKU</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {newProduct.sku === 'custom' && (
                    <div>
                      <Input
                        type="text"
                        placeholder="Enter custom SKU"
                        value={customSkuValue}
                        onChange={(e) => setCustomSkuValue(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={newProduct.qty || ''}
                      onChange={(e) => handleChange('qty', parseInt(e.target.value) || 0)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <Input
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <Button
                      size="icon"
                      variant="ghost" 
                      onClick={handleSaveLine}
                      className="ml-auto"
                    >
                      <Check className="h-5 w-5 text-green-500" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Input
                    type="text"
                    placeholder="Description (optional)"
                    value={newProduct.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            )}
            
            <CustomerProductTable 
              customerIdFilter={customer.id} 
              onEdit={() => {}} 
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CustomerList;
