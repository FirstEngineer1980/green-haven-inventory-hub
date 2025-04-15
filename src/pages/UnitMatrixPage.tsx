
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useUnitMatrix } from '@/context/UnitMatrixContext';
import { useRooms } from '@/context/RoomContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import FlexibleUnitMatrix from '@/components/unit-matrix/FlexibleUnitMatrix';
import AddUnitMatrixDialog from '@/components/unit-matrix/AddUnitMatrixDialog';
import EditUnitMatrixDialog from '@/components/unit-matrix/EditUnitMatrixDialog';
import { UnitMatrix } from '@/types';
import ExportButton from '@/components/shared/ExportButton';
import ImportButton from '@/components/shared/ImportButton';
import { getTemplateUrl, validateTemplate } from '@/utils/templateGenerator';

const UnitMatrixPage = () => {
  const { unitMatrices, deleteUnitMatrix, addUnitMatrix } = useUnitMatrix();
  const { rooms } = useRooms();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUnitMatrix, setSelectedUnitMatrix] = useState<UnitMatrix | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleMatrixImport = (data: any[]) => {
    try {
      data.forEach(matrixData => {
        const matrix = {
          roomId: matrixData.roomId,
          name: matrixData.name,
          rows: matrixData.rows || []
        };
        addUnitMatrix(matrix);
      });
      
      toast({
        title: "Unit Matrices imported",
        description: `${data.length} unit matrices have been imported successfully`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error importing unit matrices:', error);
      toast({
        title: "Import failed",
        description: "An error occurred while importing unit matrices",
        variant: "destructive",
      });
    }
  };

  // Filter unit matrices based on search and filters
  const filteredUnitMatrices = unitMatrices.filter(unitMatrix => 
    (selectedRoom === 'all' || unitMatrix.roomId === selectedRoom) &&
    unitMatrix.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (unitMatrix: UnitMatrix) => {
    setSelectedUnitMatrix(unitMatrix);
    setShowEditDialog(true);
  };

  const handleDeleteUnitMatrix = (id: string) => {
    deleteUnitMatrix(id);
    
    toast({
      title: "Unit Matrix Deleted",
      description: "The unit matrix has been removed from the system",
      variant: "default"
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Unit Matrix</h1>
          <div className="flex gap-2">
            <ImportButton 
              onImport={handleMatrixImport} 
              templateUrl={getTemplateUrl('unitMatrices')}
              validationFn={(data) => validateTemplate(data, 'unitMatrices')}
            />
            <ExportButton 
              data={unitMatrices} 
              filename="unit_matrices" 
              fields={['id', 'roomId', 'roomName', 'name', 'rows', 'createdAt', 'updatedAt']}
            />
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Unit Matrix
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input 
              placeholder="Search unit matrices..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="w-full sm:w-48">
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by room" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Rooms</SelectItem>
                {rooms.map(room => (
                  <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Unit Matrices ({filteredUnitMatrices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUnitMatrices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No unit matrices found
              </div>
            ) : (
              filteredUnitMatrices.map(unitMatrix => (
                <div key={unitMatrix.id} className="mb-8">
                  <FlexibleUnitMatrix 
                    unitMatrix={unitMatrix} 
                    onEdit={handleEditClick}
                    onDelete={handleDeleteUnitMatrix}
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <AddUnitMatrixDialog 
          open={showAddDialog} 
          onOpenChange={setShowAddDialog} 
        />
        
        {selectedUnitMatrix && (
          <EditUnitMatrixDialog 
            open={showEditDialog} 
            onOpenChange={setShowEditDialog}
            unitMatrix={selectedUnitMatrix}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default UnitMatrixPage;
