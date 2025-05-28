
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRooms } from '@/context/RoomContext';
import { useCustomers } from '@/context/CustomerContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RoomTable from '@/components/rooms/RoomTable';
import AddRoomDialog from '@/components/rooms/AddRoomDialog';
import EditRoomDialog from '@/components/rooms/EditRoomDialog';
import ExportButton from '@/components/shared/ExportButton';
import ImportButton from '@/components/shared/ImportButton';
import { getTemplateUrl, validateTemplate } from '@/utils/templateGenerator';

const Rooms = () => {
  const { rooms, addRoom, updateRoom, deleteRoom } = useRooms();
  const { customers } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [customerFilter, setCustomerFilter] = useState<string>('all');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    customerId: '',
    unit: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (selectedRoom) {
      setFormData({
        name: selectedRoom.name,
        customerId: selectedRoom.customerId,
        unit: selectedRoom.unit || '',
      });
    }
  }, [selectedRoom]);

  const handleRoomImport = (data: any[]) => {
    try {
      data.forEach(roomData => {
        const room = {
          name: roomData.name,
          customerId: roomData.customerId,
          description: roomData.description || `Room for customer`,
          capacity: parseInt(roomData.capacity, 10) || 100,
          unit: roomData.unit || '',
          units: []
        };
        addRoom(room);
      });

      toast({
        title: "Rooms imported",
        description: `${data.length} rooms have been imported successfully`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error importing rooms:', error);
      toast({
        title: "Import failed",
        description: "An error occurred while importing rooms",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddRoom = (formData: any) => {
    addRoom({
      name: formData.name,
      customerId: formData.customerId,
      unit: formData.unit,
      description: `Room for customer`,
      capacity: 100,
      units: []
    });
    setOpenAddDialog(false);
    setFormData({ name: '', customerId: '', unit: '' });
    toast({
      title: "Room added",
      description: "The room has been added successfully",
      variant: "default",
    });
  };

  const handleEditRoom = () => {
    updateRoom(selectedRoom.id, {
      name: formData.name,
      customerId: formData.customerId,
      description: `Room for customer`,
      capacity: 100,
      unit: formData.unit,
      units: []
    });
    setOpenEditDialog(false);
    setSelectedRoom(null);
    setFormData({ name: '', customerId: '', unit: '' });
    toast({
      title: "Room updated",
      description: "The room has been updated successfully",
      variant: "default",
    });
  };

  const handleDeleteRoom = (roomId: string) => {
    deleteRoom(roomId);
    toast({
      title: "Room deleted",
      description: "The room has been deleted successfully",
      variant: "default",
    });
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCustomer = customerFilter === 'all' || room.customerId === customerFilter;
    return matchesSearch && matchesCustomer;
  });

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Rooms</h1>
        <div className="flex gap-2">
          <ImportButton
            onImport={handleRoomImport}
            templateUrl={getTemplateUrl('rooms')}
            validationFn={(data) => validateTemplate(data, 'rooms')}
          />
          <ExportButton data={rooms} filename="rooms" fields={['id', 'name', 'customerId', 'unit']} />
          <Button onClick={() => setOpenAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Room
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-64">
          <Select value={customerFilter} onValueChange={setCustomerFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by customer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
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
          <CardTitle>Rooms</CardTitle>
          <CardDescription>
            Manage rooms and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoomTable
            rooms={filteredRooms}
            onEdit={room => {
              setSelectedRoom(room);
              setOpenEditDialog(true);
            }}
            onDelete={handleDeleteRoom}
            onView={() => {}}
          />
        </CardContent>
      </Card>

      <AddRoomDialog
        showAddDialog={openAddDialog}
        setShowAddDialog={setOpenAddDialog}
        formData={{
          customerId: formData.customerId,
          name: formData.name,
          unit: parseFloat(formData.unit) || 0
        }}
        customers={customers}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleAddRoom={() => handleAddRoom(formData)}
      />

      {selectedRoom && (
        <EditRoomDialog
          showEditDialog={openEditDialog}
          setShowEditDialog={setOpenEditDialog}
          formData={{
            customerId: formData.customerId,
            name: formData.name,
            unit: parseFloat(formData.unit) || 0
          }}
          customers={customers}
          handleInputChange={handleInputChange}
          handleEditRoom={handleEditRoom}
        />
      )}
    </DashboardLayout>
  );
};

export default Rooms;
