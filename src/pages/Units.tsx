import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUnits } from '@/context/UnitContext';
import { useRooms } from '@/context/RoomContext';
import UnitFilters from '@/components/units/UnitFilters';
import UnitTable from '@/components/units/UnitTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import AddUnitDialog from '@/components/units/AddUnitDialog';
import EditUnitDialog from '@/components/units/EditUnitDialog';
import UnitDetails from '@/components/units/UnitDetails';
import { Unit } from '@/types';
import { useToast } from '@/hooks/use-toast';
import ExportButton from '@/components/shared/ExportButton';
import ImportButton from '@/components/shared/ImportButton';
import { getTemplateUrl, validateTemplate } from '@/utils/templateGenerator';

const Units = () => {
  const { units, addUnit, updateUnit } = useUnits();
  const { rooms } = useRooms();
  const [searchTerm, setSearchTerm] = useState('');
  const [roomFilter, setRoomFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    roomId: '',
    number: '',
    size: 0,
    sizeUnit: 'sqft',
    status: 'available',
    description: ''
  });
  const { toast } = useToast();
  
  const handleUnitImport = (data: any[]) => {
    try {
      data.forEach(unitData => {
        const unit = {
          name: unitData.name || `Unit ${unitData.number}`,
          roomId: unitData.roomId,
          number: unitData.number,
          size: unitData.size,
          sizeUnit: unitData.sizeUnit,
          status: unitData.status,
          description: unitData.description
        };
        addUnit(unit);
      });
      
      toast({
        title: "Units imported",
        description: `${data.length} units have been imported successfully`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error importing units:', error);
      toast({
        title: "Import failed",
        description: "An error occurred while importing units",
        variant: "destructive",
      });
    }
  };

  const handleAddUnit = () => {
    addUnit({
      name: formData.name,
      roomId: formData.roomId,
      number: formData.number,
      capacity: formData.size,
      currentStock: 0,
      size: formData.size,
      sizeUnit: formData.sizeUnit as 'sqft' | 'sqm' | 'm²',
      status: formData.status as 'available' | 'occupied' | 'maintenance',
      description: formData.description
    });
    setShowAddDialog(false);
  };

  const handleEditUnit = () => {
    updateUnit(selectedUnit!.id, {
      name: formData.name,
      roomId: formData.roomId,
      number: formData.number,
      capacity: formData.size,
      currentStock: selectedUnit!.currentStock,
      size: formData.size,
      sizeUnit: formData.sizeUnit as 'sqft' | 'sqm' | 'm²',
      status: formData.status as 'available' | 'occupied' | 'maintenance',
      description: formData.description
    });
    setShowEditDialog(false);
    setSelectedUnit(null);
  };

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoom = roomFilter === 'all' || unit.roomId === roomFilter;
    const matchesStatus = statusFilter === 'all' || unit.status === statusFilter;
    
    return matchesSearch && matchesRoom && matchesStatus;
  });
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
  const paginatedUnits = filteredUnits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteConfirm = (id: string) => {
    setCurrentPage(1);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Units</h1>
        <div className="flex gap-2">
          <ImportButton 
            onImport={handleUnitImport} 
            templateUrl={getTemplateUrl('units')}
            validationFn={(data) => validateTemplate(data, 'units')}
          />
          <ExportButton 
            data={units} 
            filename="units" 
            fields={['id', 'roomId', 'roomName', 'number', 'size', 'sizeUnit', 'status', 'description', 'createdAt', 'updatedAt']}
          />
          <Button onClick={() => setOpenAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Unit
          </Button>
        </div>
      </div>

      <UnitFilters 
        searchTerm={searchTerm}
        onSearchChange={(value) => setSearchTerm(value)}
        roomFilter={roomFilter}
        onRoomFilterChange={(value) => setRoomFilter(value)}
        statusFilter={statusFilter}
        onStatusFilterChange={(value) => setStatusFilter(value)}
        rooms={rooms}
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Storage Units</CardTitle>
          <CardDescription>
            Manage individual storage units within rooms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UnitTable 
            units={paginatedUnits}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            onEdit={(unit) => {
              setSelectedUnit(unit);
              setOpenEditDialog(true);
            }}
            onView={(unit) => {
              setSelectedUnit(unit);
              setOpenDetailsDialog(true);
            }}
            onDelete={handleDeleteConfirm}
          />
        </CardContent>
      </Card>

      <AddUnitDialog 
        showAddDialog={openAddDialog} 
        setShowAddDialog={setOpenAddDialog}
        formData={formData}
        rooms={rooms}
        handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        handleSelectChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        handleAddUnit={handleAddUnit}
      />
      
      {selectedUnit && (
        <>
          <EditUnitDialog 
            showEditDialog={openEditDialog} 
            setShowEditDialog={setOpenEditDialog} 
            formData={{
              name: selectedUnit.name,
              roomId: selectedUnit.roomId,
              number: selectedUnit.number,
              size: selectedUnit.size || 0,
              sizeUnit: selectedUnit.sizeUnit || 'sqft',
              status: selectedUnit.status || 'available',
              description: selectedUnit.description || ''
            }}
            rooms={rooms}
            handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
            handleSelectChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
            handleEditUnit={handleEditUnit}
          />
          
          <UnitDetails
            unit={selectedUnit}
            isOpen={openDetailsDialog}
            onClose={() => setOpenDetailsDialog(false)}
            onEdit={(unit) => {
              setSelectedUnit(unit);
              setOpenDetailsDialog(false);
              setOpenEditDialog(true);
            }}
            onDelete={() => {}}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default Units;
