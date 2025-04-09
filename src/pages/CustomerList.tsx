
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCustomers } from '@/context/CustomerContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import CustomerProductTable from '@/components/customer-products/CustomerProductTable';

const CustomerList = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { customers } = useCustomers();
  
  const customer = customers.find(c => c.id === customerId);
  
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
            
            <h3 className="text-lg font-medium mb-4">Customer Products</h3>
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
