import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCustomers } from '@/context/CustomerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, PlusCircle, User, Phone, Mail, MapPin, Building, Clock, MoreHorizontal, Edit, Trash2, Pause, Play, Eye, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Customer } from '@/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImportCustomersDialog } from '@/components/customers/ImportCustomersDialog';

const Customers = () => {
  const { customers, toggleCustomerStatus, deleteCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'inactive'>('all');
  const navigate = useNavigate();
  const { toast } = useToast();
  const itemsPerPage = 10;

  const filteredCustomers = customers
    .filter(customer => 
      (statusFilter === 'all' || customer.status === statusFilter) &&
      (customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      customer.phone.includes(searchTerm))
    );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const handleEditCustomer = (customerId: string) => {
    navigate(`/customers/manage/${customerId}`);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleDeleteCustomer = (customerId: string) => {
    deleteCustomer(customerId);
    toast({
      title: "Customer Deleted",
      description: "The customer has been removed from the system.",
      variant: "default"
    });
  };

  const handleToggleStatus = (customerId: string, newStatus: 'active' | 'paused' | 'inactive') => {
    toggleCustomerStatus(customerId, newStatus);
    toast({
      title: "Customer Status Updated",
      description: `Customer status has been changed to ${newStatus}.`,
      variant: "default"
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
      case 'paused':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Paused</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Inactive</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <div className="flex gap-3">
            <ImportCustomersDialog />
            <Button variant="outline" onClick={() => navigate('/customers/manage')}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                {statusFilter === 'all' ? 'All Statuses' : 
                  statusFilter === 'active' ? 'Active' : 
                  statusFilter === 'paused' ? 'Paused' : 'Inactive'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuItem onClick={() => setStatusFilter('all')}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('active')}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('paused')}>
                Paused
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCustomers.map(customer => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.company || '-'}</TableCell>
                      <TableCell>{getStatusBadge(customer.status)}</TableCell>
                      <TableCell>{customer.totalOrders}</TableCell>
                      <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditCustomer(customer.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/customer-list/${customer.id}`)}>
                              <List className="mr-2 h-4 w-4" />
                              List
                            </DropdownMenuItem>
                            {customer.status === 'active' ? (
                              <DropdownMenuItem onClick={() => handleToggleStatus(customer.id, 'paused')}>
                                <Pause className="mr-2 h-4 w-4" />
                                Pause
                              </DropdownMenuItem>
                            ) : customer.status === 'paused' || customer.status === 'inactive' ? (
                              <DropdownMenuItem onClick={() => handleToggleStatus(customer.id, 'active')}>
                                <Play className="mr-2 h-4 w-4" />
                                Activate
                              </DropdownMenuItem>
                            ) : null}
                            <Dialog>
                              <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Confirm Deletion</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to delete {customer.name}? This action cannot be undone.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button 
                                    variant="destructive" 
                                    onClick={() => {
                                      handleDeleteCustomer(customer.id);
                                      document.querySelector("[data-state='open']")?.dispatchEvent(
                                        new Event('close', { bubbles: true })
                                      );
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
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
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{selectedCustomer.name}</h2>
                    <p className="text-muted-foreground text-sm">{selectedCustomer.company || 'Individual Customer'}</p>
                  </div>
                  <div>
                    {getStatusBadge(selectedCustomer.status)}
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
                <Button variant="outline" className="flex-1" onClick={() => handleEditCustomer(selectedCustomer.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                {selectedCustomer.status === 'active' ? (
                  <Button 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => {
                      handleToggleStatus(selectedCustomer.id, 'paused');
                      setSelectedCustomer(null);
                    }}
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                ) : (
                  <Button 
                    variant="secondary" 
                    className="flex-1"
                    onClick={() => {
                      handleToggleStatus(selectedCustomer.id, 'active');
                      setSelectedCustomer(null);
                    }}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Activate
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </DashboardLayout>
  );
};

export default Customers;
