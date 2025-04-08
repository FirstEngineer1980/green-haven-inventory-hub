
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useUnits } from '@/context/UnitContext';
import { useRooms } from '@/context/RoomContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Unit } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Import components
import UnitTable from '@/components/units/UnitTable';
import UnitFilters from '@/components/units/UnitFilters';
import AddUnitDialog from '@/components/units/AddUnitDialog';
import EditUnitDialog from '@/components/units/EditUnitDialog';
import UnitDetails from '@/components/units/UnitDetails';

const Units = () => {
  const { units, addUnit, updateUnit, deleteUnit } = useUnits();
  const { rooms } = useRooms();
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const itemsPerPage = 10;
  const { toast } = useToast();

  // Unit form state
  const [formData, setFormData] = useState<{
    roomId: string;
    number: string;
    size: number;
    sizeUnit: 'sqft' | 'sqm' | 'm²';
    status: 'available' | 'occupied' | 'maintenance';
    description: string;
  }>({
    roomId: '',
    number: '',
    size: 0,
    sizeUnit: 'sqft',
    status: 'available',
    description: ''
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'size' ? parseInt(value) || 0 : value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Filter change handlers
  const handleRoomFilterChange = (value: string) => {
    setSelectedRoom(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setSelectedStatus(value);
    setCurrentPage(1);
  };

  // Filter units based on search and filters
  const filteredUnits = units.filter(unit => 
    (selectedRoom === 'all' || unit.roomId === selectedRoom) &&
    (selectedStatus === 'all' || unit.status === selectedStatus) &&
    (unit.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
     unit.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (unit.description && unit.description.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
  const paginatedUnits = filteredUnits.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setFormData({
      roomId: '',
      number: '',
      size: 0,
      sizeUnit: 'sqft',
      status: 'available',
      description: ''
    });
  };

  const handleAddUnit = () => {
    if (!formData.roomId || !formData.number) {
      toast({
        title: "Validation Error",
        description: "Room and Unit Number are required fields",
        variant: "destructive"
      });
      return;
    }

    addUnit({
      roomId: formData.roomId,
      number: formData.number,
      size: formData.size,
      sizeUnit: formData.sizeUnit,
      status: formData.status,
      description: formData.description
    });

    toast({
      title: "Unit Added",
      description: "The unit has been successfully added",
      variant: "default"
    });

    resetForm();
    setShowAddDialog(false);
  };

  const handleEditUnit = () => {
    if (!selectedUnit || !formData.roomId || !formData.number) {
      toast({
        title: "Validation Error",
        description: "Room and Unit Number are required fields",
        variant: "destructive"
      });
      return;
    }

    updateUnit(selectedUnit.id, {
      roomId: formData.roomId,
      number: formData.number,
      size: formData.size,
      sizeUnit: formData.sizeUnit,
      status: formData.status,
      description: formData.description
    });

    toast({
      title: "Unit Updated",
      description: "The unit has been successfully updated",
      variant: "default"
    });

    setShowEditDialog(false);
    setSelectedUnit(null);
  };

  const handleDeleteUnit = (id: string) => {
    deleteUnit(id);
    
    toast({
      title: "Unit Deleted",
      description: "The unit has been removed from the system",
      variant: "default"
    });
  };

  const handleEditClick = (unit: Unit) => {
    setSelectedUnit(unit);
    setFormData({
      roomId: unit.roomId,
      number: unit.number,
      size: unit.size,
      sizeUnit: unit.sizeUnit,
      status: unit.status,
      description: unit.description || ''
    });
    setShowEditDialog(true);
  };

  const handleViewUnit = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Room Units</h1>
          <Button onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Unit
          </Button>
        </div>

        <UnitFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRoom={selectedRoom}
          selectedStatus={selectedStatus}
          handleRoomFilterChange={handleRoomFilterChange}
          handleStatusFilterChange={handleStatusFilterChange}
          rooms={rooms}
        />

        <Card>
          <CardHeader>
            <CardTitle>Units Directory ({filteredUnits.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <UnitTable
              units={paginatedUnits}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              onEdit={handleEditClick}
              onView={handleViewUnit}
              onDelete={handleDeleteUnit}
            />
          </CardContent>
        </Card>

        {/* Dialogs and Sheets */}
        <AddUnitDialog
          showAddDialog={showAddDialog}
          setShowAddDialog={setShowAddDialog}
          formData={formData}
          rooms={rooms}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleAddUnit={handleAddUnit}
        />
        
        <EditUnitDialog
          showEditDialog={showEditDialog}
          setShowEditDialog={setShowEditDialog}
          formData={formData}
          rooms={rooms}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          handleEditUnit={handleEditUnit}
        />

        <UnitDetails
          unit={selectedUnit}
          isOpen={!!selectedUnit && !showEditDialog}
          onClose={() => setSelectedUnit(null)}
          onEdit={handleEditClick}
          onDelete={handleDeleteUnit}
        />
      </div>
    </DashboardLayout>
  );
};

export default Units;
