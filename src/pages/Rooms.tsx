
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useRooms } from '@/context/RoomContext';
import { useCustomers } from '@/context/CustomerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Room } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Import refactored components
import RoomTable from '@/components/rooms/RoomTable';
import RoomFilters from '@/components/rooms/RoomFilters';
import AddRoomDialog from '@/components/rooms/AddRoomDialog';
import EditRoomDialog from '@/components/rooms/EditRoomDialog';
import RoomDetails from '@/components/rooms/RoomDetails';

const Rooms = () => {
  const { rooms, addRoom, updateRoom, deleteRoom } = useRooms();
  const { customers } = useCustomers();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('all');
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
    (selectedCustomer === 'all' || room.customerId === selectedCustomer) &&
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

        <RoomFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCustomer={selectedCustomer}
          handleCustomerFilterChange={handleCustomerFilterChange}
          customers={customers}
        />

        <Card>
          <CardHeader>
            <CardTitle>Rooms Directory ({filteredRooms.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <RoomTable
              rooms={paginatedRooms}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              onEdit={handleEditClick}
              onView={handleViewRoom}
              onDelete={handleDeleteRoom}
            />
          </CardContent>
        </Card>

        {/* Dialogs and Sheets */}
        <AddRoomDialog
          showAddDialog={showAddDialog}
          setShowAddDialog={setShowAddDialog}
          formData={formData}
          customers={customers}
          handleInputChange={handleInputChange}
          handleCustomerChange={handleCustomerChange}
          handleAddRoom={handleAddRoom}
        />
        
        <EditRoomDialog
          showEditDialog={showEditDialog}
          setShowEditDialog={setShowEditDialog}
          formData={formData}
          customers={customers}
          handleInputChange={handleInputChange}
          handleCustomerChange={handleCustomerChange}
          handleEditRoom={handleEditRoom}
        />

        <RoomDetails
          room={selectedRoom}
          isOpen={!!selectedRoom && !showEditDialog}
          onClose={() => setSelectedRoom(null)}
          onEdit={handleEditClick}
          onDelete={handleDeleteRoom}
        />
      </div>
    </DashboardLayout>
  );
};

export default Rooms;
