
import React, { useState } from 'react';
import { Box, Edit, Trash } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { UnitMatrix } from '@/types';
import { EditUnitMatrixDialog } from './EditUnitMatrixDialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BinTable } from '@/components/bins/BinTable';
import { AddBinDialog } from '@/components/bins/AddBinDialog';

interface UnitMatrixTableProps {
  unitMatrices: UnitMatrix[];
  onEdit: (unitMatrix: UnitMatrix) => void;
  onDelete: (id: string) => void;
}

export const UnitMatrixTable = ({ unitMatrices, onEdit, onDelete }: UnitMatrixTableProps) => {
  const [editingMatrix, setEditingMatrix] = useState<UnitMatrix | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [matrixToDelete, setMatrixToDelete] = useState<UnitMatrix | null>(null);
  const [viewingBins, setViewingBins] = useState<{ matrix: UnitMatrix, open: boolean }>({ matrix: {} as UnitMatrix, open: false });
  const [addBinOpen, setAddBinOpen] = useState(false);

  const handleEdit = (matrix: UnitMatrix) => {
    setEditingMatrix(matrix);
  };

  const handleDelete = (matrix: UnitMatrix) => {
    setMatrixToDelete(matrix);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (matrixToDelete) {
      onDelete(matrixToDelete.id);
      setDeleteConfirmOpen(false);
    }
  };

  const viewBins = (matrix: UnitMatrix) => {
    setViewingBins({ matrix, open: true });
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Rows</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {unitMatrices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                No unit matrices found
              </TableCell>
            </TableRow>
          ) : (
            unitMatrices.map((matrix) => (
              <TableRow key={matrix.id}>
                <TableCell className="font-medium">{matrix.name}</TableCell>
                <TableCell>{matrix.roomName}</TableCell>
                <TableCell>{matrix.rows.length}</TableCell>
                <TableCell>{formatDate(matrix.createdAt)}</TableCell>
                <TableCell>{formatDate(matrix.updatedAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(matrix)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(matrix)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => viewBins(matrix)}>
                      <Box className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {editingMatrix && (
        <EditUnitMatrixDialog
          open={!!editingMatrix}
          unitMatrix={editingMatrix}
          onOpenChange={(open) => !open && setEditingMatrix(null)}
        />
      )}

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the unit matrix "{matrixToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={viewingBins.open} onOpenChange={(open) => setViewingBins(prev => ({ ...prev, open }))}>
        <SheetContent className="sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Bins for {viewingBins.matrix.name}</SheetTitle>
            <SheetDescription>
              Manage bins associated with this unit matrix
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setAddBinOpen(true)}>
                Add Bin
              </Button>
            </div>
            <BinTable unitMatrixId={viewingBins.matrix.id} />
          </div>
        </SheetContent>
      </Sheet>

      {viewingBins.matrix.id && (
        <AddBinDialog
          open={addBinOpen}
          onOpenChange={setAddBinOpen}
          unitMatrixId={viewingBins.matrix.id}
        />
      )}
    </>
  );
};
