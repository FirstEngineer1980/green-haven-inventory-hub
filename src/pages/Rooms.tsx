
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRooms } from '@/context/RoomContext';
import { useCustomers } from '@/context/CustomerContext';
import RoomTable from '@/components/rooms/RoomTable';
import RoomFilters from '@/components/rooms/RoomFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddRoomDialog from '@/components/rooms/AddRoomDialog';
import EditRoomDialog from '@/components/rooms/EditRoomDialog';
import RoomDetails from '@/components/rooms/RoomDetails';
import { Room } from '@/types';
import { useToast } from '@/hooks/use-toast';
import ExportButton from '@/components/shared/ExportButton';
import ImportButton from '@/components/shared/ImportButton';
import { getTemplateUrl, validateTemplate } from '@/utils/templateGenerator';

const Rooms = () => {
  const { rooms, addRoom } = useRooms();
  const { customers } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [customerFilter, setCustomerFilter] = useState<string>('all');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();
  
  const handleRoomImport = (data: any[]) => {
    try {
      data.forEach(roomData => {
        const room = {
          name: roomData.name,
          customerId: roomData.customerId,
          unit: roomData.unit
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

  // Filter rooms by search term and customer
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
          <ExportButton 
            data={rooms} 
            filename="rooms" 
            fields={['id', 'customerId', 'customerName', 'name', 'unit', 'createdAt', 'updatedAt']}
          />
          <Button onClick={() => setOpenAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Room
          </Button>
        </div>
      </div>

      <RoomFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        customerFilter={customerFilter}
        onCustomerFilterChange={setCustomerFilter}
        customers={customers}
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Customer Rooms</CardTitle>
          <CardDescription>
            Manage customer storage rooms and locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoomTable 
            rooms={filteredRooms}
            onView={(room) => {
              setSelectedRoom(room);
              setOpenDetailsDialog(true);
            }}
            onEdit={(room) => {
              setSelectedRoom(room);
              setOpenEditDialog(true);
            }}
          />
        </CardContent>
      </Card>

      <AddRoomDialog open={openAddDialog} onOpenChange={setOpenAddDialog} />
      
      {selectedRoom && (
        <>
          <EditRoomDialog 
            open={openEditDialog} 
            onOpenChange={setOpenEditDialog} 
            room={selectedRoom} 
          />
          
          <RoomDetails
            open={openDetailsDialog}
            onOpenChange={setOpenDetailsDialog}
            room={selectedRoom}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default Rooms;
