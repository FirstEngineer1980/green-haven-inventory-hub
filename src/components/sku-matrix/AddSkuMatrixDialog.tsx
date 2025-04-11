
import React, { useState } from 'react';
import { useUnitMatrix } from '@/context/UnitMatrixContext';
import { useRooms } from '@/context/RoomContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import MatrixGeneralForm from './components/MatrixGeneralForm';
import MatrixRowList from './components/MatrixRowList';
import AddRowForm from './components/AddRowForm';
import { MatrixType } from '@/types';

interface AddSkuMatrixDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  matrixType: MatrixType;
}

const AddSkuMatrixDialog = ({ open, onOpenChange, matrixType }: AddSkuMatrixDialogProps) => {
  const { addUnitMatrix, columns } = useUnitMatrix();
  const { rooms } = useRooms();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    roomId: '',
  });
  
  const [rows, setRows] = useState<{ label: string; color: string; }[]>([]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddRow = (label: string, color: string) => {
    setRows(prev => [...prev, { label, color }]);
  };
  
  const handleRemoveRow = (index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = () => {
    if (!formData.name || !formData.roomId) {
      toast({
        title: "Validation Error",
        description: "Matrix name and room are required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (rows.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one row is required",
        variant: "destructive"
      });
      return;
    }
    
    // Add IDs to rows and create cells for each row
    const timestamp = Date.now();
    const rowsWithIds = rows.map((row, index) => {
      const rowId = `row-${timestamp}-${index}`;
      
      // Create cells for each column in this row
      const cellsForRow = columns.map(column => ({
        id: `${rowId}-${column.id}`,
        value: '',
        columnId: column.id
      }));
      
      return {
        id: rowId,
        label: row.label,
        color: row.color,
        cells: cellsForRow
      };
    });
    
    addUnitMatrix({
      name: formData.name,
      roomId: formData.roomId,
      type: matrixType,
      rows: rowsWithIds,
    });
    
    // Reset form
    setFormData({ name: '', roomId: '' });
    setRows([]);
    onOpenChange(false);
    
    const matrixTypeLabel = matrixType === 'sku' ? 'SKU' : 'Unit';
    toast({
      title: `${matrixTypeLabel} Matrix Added`,
      description: `The new ${matrixTypeLabel} matrix has been created successfully`,
      variant: "default"
    });
  };
  
  const matrixTypeLabel = matrixType === 'sku' ? 'SKU' : 'Unit';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New {matrixTypeLabel} Matrix</DialogTitle>
          <DialogDescription>
            Create a new {matrixTypeLabel.toLowerCase()} matrix and assign it to a room.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <MatrixGeneralForm 
            name={formData.name}
            roomId={formData.roomId}
            rooms={rooms}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
          />
          
          <div className="space-y-2">
            <Label>Rows</Label>
            <div className="border rounded-md p-2 bg-gray-50">
              <MatrixRowList 
                rows={rows} 
                onRemoveRow={handleRemoveRow} 
              />
              
              <AddRowForm onAddRow={handleAddRow} />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Add {matrixTypeLabel} Matrix</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSkuMatrixDialog;
