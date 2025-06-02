
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useBins } from '@/context/BinContext';
import { useUnitMatrix } from '@/context/UnitMatrixContext';
import { useRooms } from '@/context/RoomContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Bin } from '@/types';
import { AddBinDialog } from '@/components/bins/AddBinDialog';
import { EditBinDialog } from '@/components/bins/EditBinDialog';

const Bins = () => {
  const { bins, addBin, updateBin, deleteBin } = useBins();
  const { unitMatrices } = useUnitMatrix();
  const { rooms } = useRooms();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const { toast } = useToast();

  const handleAddBin = (formData: any) => {
    addBin({
      name: formData.name,
      length: parseFloat(formData.length),
      width: parseFloat(formData.width),
      height: parseFloat(formData.height),
      skuMatrixId: formData.skuMatrixId,
      roomId: formData.roomId || '',
      location: formData.location || 'Warehouse A',
      currentStock: 0,
      products: [],
      status: 'active'
    });
    setShowAddDialog(false);
    toast({
      title: "Bin added",
      description: "The bin has been added successfully",
      variant: "default",
    });
  };

  const handleEditBin = (formData: any) => {
    if (!selectedBin) return;

    updateBin(selectedBin.id, {
      name: formData.name,
      length: parseFloat(formData.length),
      width: parseFloat(formData.width),
      height: parseFloat(formData.height),
      skuMatrixId: formData.skuMatrixId,
      roomId: formData.roomId || '',
      location: formData.location || 'Warehouse A',
      currentStock: formData.currentStock,
      products: formData.products,
      status: formData.status || 'active'
    });
    setShowEditDialog(false);
    setSelectedBin(null);
    toast({
      title: "Bin updated",
      description: "The bin has been updated successfully",
      variant: "default",
    });
  };

  const handleDeleteBin = (id: string) => {
    deleteBin(id);
    toast({
      title: "Bin deleted",
      description: "The bin has been deleted successfully",
      variant: "default",
    });
  };

  const filteredBins = bins.filter(bin =>
    bin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Bins</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Bin
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search bins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bins</CardTitle>
          <CardDescription>
            Manage bins in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Length</TableHead>
                  <TableHead>Width</TableHead>
                  <TableHead>Height</TableHead>
                  <TableHead>Volume Capacity</TableHead>
                  <TableHead>SKU Matrix ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBins.map((bin) => (
                  <TableRow key={bin.id}>
                    <TableCell className="font-medium">{bin.name}</TableCell>
                    <TableCell>{bin.length}</TableCell>
                    <TableCell>{bin.width}</TableCell>
                    <TableCell>{bin.height}</TableCell>
                    <TableCell>{bin.volumeCapacity}</TableCell>
                    <TableCell>{bin.skuMatrixId}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedBin(bin);
                          setShowEditDialog(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteBin(bin.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <AddBinDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      {selectedBin && (
        <EditBinDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          bin={selectedBin}
        />
      )}
    </DashboardLayout>
  );
};

export default Bins;
