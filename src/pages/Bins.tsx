
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileDown, Box } from 'lucide-react';
import { BinTable } from '@/components/bins/BinTable';
import { AddBinDialog } from '@/components/bins/AddBinDialog';
import { Input } from '@/components/ui/input';
import { BinProvider } from '@/context/BinContext';
import { useMobile } from '@/hooks/use-mobile';

export default function Bins() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useMobile();

  return (
    <BinProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bins</h1>
            <p className="text-muted-foreground mt-1">
              Manage your storage bins and their dimensions
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button 
              onClick={() => setAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              {isMobile ? 'Add' : 'Add Bin'}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
            <div className="w-full sm:w-1/3">
              <Input
                placeholder="Search bins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline" size="icon" className="self-end">
              <FileDown className="h-4 w-4" />
            </Button>
          </div>

          <BinTable />
        </div>

        <AddBinDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
        />
      </div>
    </BinProvider>
  );
}
