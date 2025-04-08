
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useRooms } from '@/context/RoomContext';
import { useCustomers } from '@/context/CustomerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Room, Customer } from '@/types';
import { Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogClose, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const Rooms = () => {
  const { rooms, addRoom, updateRoom, deleteRoom } = useRooms();
  const { customers } = useCustomers();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const itemsPerPage = 10;
  const { toast } = useToast();

  // Room form state
  const [formData, setFormData] = useState<{
    customerId: string;
    name: string;
    unit: number;
    customerName?: string;
  }>({
    customerId: '',
    name: '',
    unit: 0,
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'unit' ? parseInt(value) || 0 : value,
    }));
  };

  // Handle customer select change
  const handleCustomerChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      customerId: value,
    }));
  };

  // Handle customer filter change
  const handleCustomerFilterChange = (value: string) => {
    setSelectedCustomer(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Filter rooms based on search and selected customer
  const filteredRooms = rooms.filter(room => 
    (selectedCustomer === '' || room.customerId === selectedCustomer) &&
    (room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     room.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     room.unit.toString().includes(searchTerm))
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setFormData({
      customerId: '',
      name: '',
      unit: 0,
    });
  };

  const handleAddRoom = () => {
    if (!formData.customerId || !formData.name) {
      toast({
        title: "Validation Error",
        description: "Customer and Room Name are required fields",
        variant: "destructive"
      });
      return;
    }

    addRoom({
      customerId: formData.customerId,
      name: formData.name,
      unit: formData.unit
    });

    toast({
      title: "Room Added",
      description: "The room has been successfully added",
      variant: "default"
    });

    resetForm();
    setShowAddDialog(false);
  };

  const handleEditRoom = () => {
    if (!selectedRoom || !formData.customerId || !formData.name) {
      toast({
        title: "Validation Error",
        description: "Customer and Room Name are required fields",
        variant: "destructive"
      });
      return;
    }

    updateRoom(selectedRoom.id, {
      customerId: formData.customerId,
      name: formData.name,
      unit: formData.unit
    });

    toast({
      title: "Room Updated",
      description: "The room has been successfully updated",
      variant: "default"
    });

    setShowEditDialog(false);
    setSelectedRoom(null);
  };

  const handleDeleteRoom = (id: string) => {
    deleteRoom(id);
    
    toast({
      title: "Room Deleted",
      description: "The room has been removed from the system",
      variant: "default"
    });
  };

  const handleEditClick = (room: Room) => {
    setSelectedRoom(room);
    setFormData({
      customerId: room.customerId,
      name: room.name,
      unit: room.unit
    });
    setShowEditDialog(true);
  };

  const handleViewRoom = (room: Room) => {
    setSelectedRoom(room);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Customer Rooms</h1>
          <Button onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Room
          </Button>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search rooms..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-48">
            <Select value={selectedCustomer} onValueChange={handleCustomerFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Customers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Customers</SelectItem>
                {customers.map(customer => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rooms Directory ({filteredRooms.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Room Name</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No rooms found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRooms.map(room => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">{room.name}</TableCell>
                      <TableCell>{room.unit}</TableCell>
                      <TableCell>{room.customerName}</TableCell>
                      <TableCell>{format(new Date(room.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell>{format(new Date(room.updatedAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewRoom(room)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(room)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Confirm Deletion</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete the room "{room.name}"? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => {
                                    handleDeleteRoom(room.id);
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
                        </div>
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

        {/* Add Room Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogDescription>
                Create a new room and assign it to a customer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer</Label>
                <Select value={formData.customerId} onValueChange={handleCustomerChange}>
                  <SelectTrigger id="customerId">
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Room Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Room name or description"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unit Number</Label>
                <Input 
                  id="unit" 
                  name="unit" 
                  type="number" 
                  value={formData.unit.toString()} 
                  onChange={handleInputChange} 
                  placeholder="Unit number"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddRoom}>Add Room</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Room Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Room</DialogTitle>
              <DialogDescription>
                Update room details for this customer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-customerId">Customer</Label>
                <Select value={formData.customerId} onValueChange={handleCustomerChange}>
                  <SelectTrigger id="edit-customerId">
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-name">Room Name</Label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Room name or description"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-unit">Unit Number</Label>
                <Input 
                  id="edit-unit" 
                  name="unit" 
                  type="number" 
                  value={formData.unit.toString()} 
                  onChange={handleInputChange} 
                  placeholder="Unit number"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button onClick={handleEditRoom}>Update Room</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Room Details Sheet */}
        {selectedRoom && (
          <Sheet open={!!selectedRoom && !showEditDialog} onOpenChange={() => setSelectedRoom(null)}>
            <SheetContent className="sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Room Details</SheetTitle>
              </SheetHeader>
              <div className="py-6 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{selectedRoom.name}</h3>
                  <p className="text-sm text-muted-foreground">Unit {selectedRoom.unit}</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium">Customer</h4>
                    <p>{selectedRoom.customerName}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Created</h4>
                    <p>{format(new Date(selectedRoom.createdAt), 'MMMM d, yyyy')}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium">Last Updated</h4>
                    <p>{format(new Date(selectedRoom.updatedAt), 'MMMM d, yyyy')}</p>
                  </div>
                </div>
                
                <div className="space-x-2 pt-4">
                  <Button variant="outline" onClick={() => handleEditClick(selectedRoom)}>
                    Edit Room
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      handleDeleteRoom(selectedRoom.id);
                      setSelectedRoom(null);
                    }}
                  >
                    Delete Room
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Rooms;
