
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
import UnitMatrixTable from '@/components/unit-matrix/UnitMatrixTable';
import AddUnitMatrixDialog from '@/components/unit-matrix/AddUnitMatrixDialog';
import EditUnitMatrixDialog from '@/components/unit-matrix/EditUnitMatrixDialog';
import { UnitMatrix } from '@/types';

const UnitMatrixPage = () => {
  const { unitMatrices, deleteUnitMatrix } = useUnitMatrix();
  const { rooms } = useRooms();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUnitMatrix, setSelectedUnitMatrix] = useState<UnitMatrix | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

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
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Unit Matrix
          </Button>
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
            {filteredUnitMatrices.map(unitMatrix => (
              <div key={unitMatrix.id} className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{unitMatrix.name} - {unitMatrix.roomName}</h3>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(unitMatrix)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteUnitMatrix(unitMatrix.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
                <UnitMatrixTable unitMatrix={unitMatrix} />
              </div>
            ))}
            
            {filteredUnitMatrices.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No unit matrices found
              </div>
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
