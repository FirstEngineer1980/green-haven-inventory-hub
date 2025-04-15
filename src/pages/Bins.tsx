
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBins } from '@/context/BinContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import BinTable from '@/components/bins/BinTable';
import AddBinDialog from '@/components/bins/AddBinDialog';
import EditBinDialog from '@/components/bins/EditBinDialog';
import { Bin } from '@/types';
import { useToast } from '@/hooks/use-toast';
import ExportButton from '@/components/shared/ExportButton';
import ImportButton from '@/components/shared/ImportButton';
import { getTemplateUrl, validateTemplate } from '@/utils/templateGenerator';

const Bins = () => {
  const { bins, addBin } = useBins();
  const [searchTerm, setSearchTerm] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { toast } = useToast();

  const handleBinImport = (data: any[]) => {
    try {
      data.forEach(binData => {
        const bin = {
          name: binData.name,
          length: binData.length,
          width: binData.width,
          height: binData.height,
          volumeCapacity: binData.volumeCapacity,
          unitMatrixId: binData.unitMatrixId
        };
        addBin(bin);
      });
      
      toast({
        title: "Bins imported",
        description: `${data.length} bins have been imported successfully`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error importing bins:', error);
      toast({
        title: "Import failed",
        description: "An error occurred while importing bins",
        variant: "destructive",
      });
    }
  };

  // Filter bins by search term
  const filteredBins = bins.filter(bin => 
    bin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Bins</h1>
        <div className="flex gap-2">
          <ImportButton 
            onImport={handleBinImport} 
            templateUrl={getTemplateUrl('bins')}
            validationFn={(data) => validateTemplate(data, 'bins')}
          />
          <ExportButton 
            data={bins} 
            filename="bins" 
            fields={['id', 'name', 'length', 'width', 'height', 'volumeCapacity', 'unitMatrixId', 'unitMatrixName', 'createdAt', 'updatedAt']}
          />
          <Button onClick={() => setOpenAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Bin
          </Button>
        </div>
      </div>

      <div className="flex mb-6">
        <Input
          placeholder="Search bins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Storage Bins</CardTitle>
          <CardDescription>
            Manage storage bins for inventory items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BinTable 
            bins={filteredBins}
            onEdit={(bin) => {
              setSelectedBin(bin);
              setOpenEditDialog(true);
            }}
          />
        </CardContent>
      </Card>

      <AddBinDialog open={openAddDialog} onOpenChange={setOpenAddDialog} />
      
      {selectedBin && (
        <EditBinDialog 
          open={openEditDialog} 
          onOpenChange={setOpenEditDialog} 
          bin={selectedBin} 
        />
      )}
    </DashboardLayout>
  );
};

export default Bins;
