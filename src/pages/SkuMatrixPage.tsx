
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSkuMatrix } from '@/context/SkuMatrixContext';
import { useRooms } from '@/context/RoomContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import EnhancedSkuMatrixTable from '@/components/sku-matrix/EnhancedSkuMatrixTable';
import AddSkuMatrixDialog from '@/components/sku-matrix/AddSkuMatrixDialog';
import EditSkuMatrixDialog from '@/components/sku-matrix/EditSkuMatrixDialog';
import { SkuMatrix } from '@/context/SkuMatrixContext';
import { UnitMatrix } from '@/types';
import { useAuth } from '@/context/AuthContext';

const SkuMatrixPage = () => {
  const { skuMatrices = [], deleteSkuMatrix, error, fetchSkuMatrices, loading } = useSkuMatrix();
  const { rooms = [] } = useRooms();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedSkuMatrix, setSelectedSkuMatrix] = useState<SkuMatrix | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [hasInitiallyFetched, setHasInitiallyFetched] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Fetch data when component mounts, but only once
  useEffect(() => {
    if (isAuthenticated && !hasInitiallyFetched) {
      console.log('Initial fetch of SKU matrices...');
      fetchSkuMatrices();
      setHasInitiallyFetched(true);
    }
  }, [isAuthenticated, hasInitiallyFetched]);

  // Helper function to convert SkuMatrix to UnitMatrix (for legacy components)
  const convertSkuMatrixToUnitMatrix = (skuMatrix: SkuMatrix): UnitMatrix => {
    return {
      id: skuMatrix.id,
      name: skuMatrix.name,
      description: skuMatrix.description || '',
      roomId: skuMatrix.roomId,
      roomName: skuMatrix.roomName,
      rows: Array.isArray(skuMatrix.rows) ? skuMatrix.rows.map(row => ({
        id: row.id,
        name: row.label,
        label: row.label,
        color: row.color,
        cells: Array.isArray(row.cells) ? row.cells.map(cell => ({
          id: cell.id,
          value: cell.value || '',
          content: cell.value,
          columnId: cell.columnId,
          productId: undefined,
          quantity: undefined
        })) : []
      })) : [],
      createdAt: skuMatrix.createdAt,
      updatedAt: skuMatrix.updatedAt
    };
  };

  // Filter SKU matrices based on search and filters - with safety checks
  const filteredSkuMatrices = Array.isArray(skuMatrices) ? skuMatrices.filter(skuMatrix => 
    (selectedRoom === 'all' || skuMatrix.roomId === selectedRoom) &&
    skuMatrix.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const handleEditClick = (skuMatrix: SkuMatrix) => {
    setSelectedSkuMatrix(skuMatrix);
    setShowEditDialog(true);
  };

  const handleDeleteSkuMatrix = async (id: string) => {
    try {
      await deleteSkuMatrix(id);
      toast({
        title: "SKU Matrix Deleted",
        description: "The SKU matrix has been removed from the system",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete SKU matrix",
        variant: "destructive"
      });
    }
  };

  // Show error message if there's an API error
  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-tight">SKU Matrix</h1>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-destructive mb-4">Error loading SKU matrices: {error}</p>
                <p className="text-muted-foreground mb-4">
                  This might be because the SKU matrix feature is not yet implemented in the backend.
                </p>
                <Button onClick={() => fetchSkuMatrices()} disabled={loading}>
                  {loading ? 'Retrying...' : 'Retry'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">SKU Matrix</h1>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add SKU Matrix
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <Input 
              placeholder="Search SKU matrices..." 
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
                {Array.isArray(rooms) && rooms.map(room => (
                  <SelectItem key={room.id} value={room.id}>{room.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>SKU Matrices ({filteredSkuMatrices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                <p className="mt-4 text-muted-foreground">Loading SKU matrices...</p>
              </div>
            ) : filteredSkuMatrices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-4">No SKU matrices found</p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First SKU Matrix
                </Button>
              </div>
            ) : (
              <>
                {filteredSkuMatrices.map(skuMatrix => (
                  <div key={skuMatrix.id} className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">{skuMatrix.name} - {skuMatrix.roomName}</h3>
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(skuMatrix)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteSkuMatrix(skuMatrix.id)}>
                          Delete
                        </Button>
                      </div>
                    </div>
                    <EnhancedSkuMatrixTable 
                      skuMatrix={skuMatrix}
                      onUpdate={async () => {
                        // Refresh data so selections appear immediately after save
                        await fetchSkuMatrices();
                      }}
                    />
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>

        <AddSkuMatrixDialog 
          open={showAddDialog} 
          onOpenChange={setShowAddDialog} 
        />
        
        {selectedSkuMatrix && (
          <EditSkuMatrixDialog 
            open={showEditDialog} 
            onOpenChange={setShowEditDialog}
            unitMatrix={convertSkuMatrixToUnitMatrix(selectedSkuMatrix)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default SkuMatrixPage;
