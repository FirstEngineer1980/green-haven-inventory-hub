
import React, { useState } from 'react';
import { SkuMatrix } from '@/context/SkuMatrixContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface EnhancedSkuMatrixTableProps {
  skuMatrix: SkuMatrix;
  onUpdate?: (matrix: SkuMatrix) => void;
}

const EnhancedSkuMatrixTable = ({ skuMatrix, onUpdate }: EnhancedSkuMatrixTableProps) => {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [cellValue, setCellValue] = useState('');

  // Mock columns for now - in a real app this would come from context
  const columns = [
    { id: 'col-1', label: 'Column 1' },
    { id: 'col-2', label: 'Column 2' },
    { id: 'col-3', label: 'Column 3' },
    { id: 'col-4', label: 'Column 4' },
    { id: 'col-5', label: 'Column 5' },
  ];

  // Mock bin options - in a real app this would come from an API
  const binOptions = [
    { id: 'bin-1', name: 'Bin A1' },
    { id: 'bin-2', name: 'Bin A2' },
    { id: 'bin-3', name: 'Bin B1' },
    { id: 'bin-4', name: 'Bin B2' },
  ];

  const handleCellEdit = (cellId: string, currentValue: string) => {
    setEditingCell(cellId);
    setCellValue(currentValue || '');
  };

  const handleCellSave = () => {
    console.log('Saving cell:', editingCell, 'with value:', cellValue);
    setEditingCell(null);
    setCellValue('');
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setCellValue('');
  };

  const handleSelectChange = (cellId: string, value: string) => {
    console.log('Select changed for cell:', cellId, 'new value:', value);
    // Here you would update the actual matrix data
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Row</TableHead>
              {columns.map(column => (
                <TableHead key={column.id} className="min-w-32">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(skuMatrix.rows) && skuMatrix.rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: row.color || '#FFFFFF' }}
                    />
                    <span className="font-medium">{row.label}</span>
                  </div>
                </TableCell>
                {columns.map(column => {
                  const cell = Array.isArray(row.cells) ? row.cells.find(c => c.columnId === column.id) : null;
                  const cellId = cell?.id || `${row.id}-${column.id}`;
                  const cellValue = cell?.value || '';
                  const isEditing = editingCell === cellId;

                  return (
                    <TableCell key={column.id}>
                      {isEditing ? (
                        <div className="flex space-x-1">
                          <Input
                            value={cellValue}
                            onChange={(e) => setCellValue(e.target.value)}
                            className="h-8"
                            autoFocus
                          />
                          <Button size="sm" onClick={handleCellSave}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCellCancel}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Select
                          value={cellValue || 'no-selection'}
                          onValueChange={(value) => handleSelectChange(cellId, value === 'no-selection' ? '' : value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select bin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no-selection">No bin selected</SelectItem>
                            {binOptions.map(bin => (
                              <SelectItem key={bin.id} value={bin.id}>
                                {bin.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                  );
                })}
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Delete row:', row.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => console.log('Add row')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Row
        </Button>
        <Button variant="outline" onClick={() => console.log('Add column')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Column
        </Button>
      </div>
    </div>
  );
};

export default EnhancedSkuMatrixTable;
