
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCustomers } from '@/context/CustomerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, PlusCircle, User, Phone, Mail, MapPin, Building, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Customer } from '@/types';
import { format } from 'date-fns';

const Customers = () => {
  const { customers } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const itemsPerPage = 10;

  // Filter customers based on search term
  const filteredCustomers = customers
    .filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      customer.phone.includes(searchTerm)
    );

  // Calculate pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <div className="flex gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add New Customer</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {/* Add customer form would go here */}
                  <p className="text-gray-500">Customer creation form would be implemented here</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search customers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer Directory ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCustomers.map(customer => (
                    <TableRow key={customer.id} onClick={() => setSelectedCustomer(customer)} className="cursor-pointer">
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.company || '-'}</TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          isActive={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Details Sheet */}
      {selectedCustomer && (
        <Sheet open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <SheetContent className="sm:max-w-xl">
            <SheetHeader>
              <SheetTitle>Customer Details</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 border-b pb-4">
                  <div className="h-16 w-16 rounded-full bg-gh-green text-white flex items-center justify-center text-2xl">
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedCustomer.name}</h2>
                    <p className="text-muted-foreground text-sm">{selectedCustomer.company || 'Individual Customer'}</p>
                  </div>
                </div>
                
                <Tabs defaultValue="info">
                  <TabsList className="w-full">
                    <TabsTrigger value="info" className="flex-1">Customer Info</TabsTrigger>
                    <TabsTrigger value="orders" className="flex-1">Orders</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm">{selectedCustomer.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-sm">{selectedCustomer.phone}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Address</p>
                          <p className="text-sm">{selectedCustomer.address}</p>
                        </div>
                      </div>
                      
                      {selectedCustomer.company && (
                        <div className="flex items-center gap-3">
                          <Building className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Company</p>
                            <p className="text-sm">{selectedCustomer.company}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Customer Since</p>
                          <p className="text-sm">{format(new Date(selectedCustomer.createdAt), 'MMMM d, yyyy')}</p>
                        </div>
                      </div>
                      
                      {selectedCustomer.notes && (
                        <div className="border-t pt-4 mt-2">
                          <p className="text-sm font-medium mb-1">Notes</p>
                          <p className="text-sm">{selectedCustomer.notes}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="orders" className="pt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold">{selectedCustomer.totalOrders}</div>
                              <p className="text-sm text-muted-foreground">Total Orders</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold">${selectedCustomer.totalSpent.toFixed(2)}</div>
                              <p className="text-sm text-muted-foreground">Total Spent</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <p className="text-muted-foreground text-sm py-4">
                        Order history would be displayed here
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">Edit Customer</Button>
                <Button variant="secondary" className="flex-1">New Order</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </DashboardLayout>
  );
};

export default Customers;
