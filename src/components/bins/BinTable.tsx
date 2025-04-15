import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Bin } from '@/types';
import { useBins } from '@/context/BinContext';
import { EditBinDialog } from './EditBinDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface BinTableProps {
  bins?: Bin[]; // Made optional with default from context
  unitMatrixId?: string;
  onEdit?: (bin: Bin) => void; // Made optional to fix the TypeScript error
}

export const BinTable: React.FC<BinTableProps> = ({ bins: propBins, unitMatrixId, onEdit }) => {
  const { bins: contextBins, deleteBin, getBinsByUnitMatrix } = useBins();
  const [editBin, setEditBin] = useState<Bin | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [binToDelete, setBinToDelete] = useState<Bin | null>(null);

  // Use bins from props if provided, otherwise use filtered bins from context
  const bins = propBins ?? (unitMatrixId 
    ? getBinsByUnitMatrix(unitMatrixId) 
    : contextBins);

  const handleEdit = (bin: Bin) => {
    if (onEdit) {
      onEdit(bin);
    } else {
      setEditBin(bin);
    }
  };

  const handleDeleteClick = (bin: Bin) => {
    setBinToDelete(bin);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (binToDelete) {
      deleteBin(binToDelete.id);
      setDeleteConfirmOpen(false);
      setBinToDelete(null);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Length (cm)</TableHead>
            <TableHead>Width (cm)</TableHead>
            <TableHead>Height (cm)</TableHead>
            <TableHead>Volume (cm³)</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No bins found
              </TableCell>
            </TableRow>
          ) : (
            bins.map((bin) => (
              <TableRow key={bin.id}>
                <TableCell className="font-medium">{bin.name}</TableCell>
                <TableCell>{bin.length}</TableCell>
                <TableCell>{bin.width}</TableCell>
                <TableCell>{bin.height}</TableCell>
                <TableCell>{bin.volumeCapacity.toLocaleString()}</TableCell>
                <TableCell>{formatDate(bin.createdAt)}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(bin)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteClick(bin)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {editBin && !onEdit && (
        <EditBinDialog
          open={!!editBin}
          onOpenChange={(open) => !open && setEditBin(null)}
          bin={editBin}
        />
      )}

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete bin "{binToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
