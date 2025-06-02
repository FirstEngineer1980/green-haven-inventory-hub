
import React, { useState, useEffect } from 'react';
import { SkuMatrix } from '@/context/SkuMatrixContext';
import { useBins } from '@/context/BinContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Save, Edit, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Column {
  id: string;
  label: string;
}

interface EnhancedSkuMatrixTableProps {
  skuMatrix: SkuMatrix;
  onUpdate?: (skuMatrix: SkuMatrix) => void;
}

const EnhancedSkuMatrixTable = ({ skuMatrix, onUpdate }: EnhancedSkuMatrixTableProps) => {
  const { bins = [] } = useBins();
  const [editMode, setEditMode] = useState(false);
  const [columns, setColumns] = useState<Column[]>([
    { id: '1', label: 'Column 1' },
    { id: '2', label: 'Column 2' },
    { id: '3', label: 'Column 3' }
  ]);
  const [newRowLabel, setNewRowLabel] = useState('');
  const [newRowColor, setNewRowColor] = useState('#FFFFFF');
  const [newColumnLabel, setNewColumnLabel] = useState('');
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnLabel, setEditingColumnLabel] = useState('');
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingRowLabel, setEditingRowLabel] = useState('');
  const [editingRowColor, setEditingRowColor] = useState('');
  const [cellValues, setCellValues] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  useEffect(() => {
    // Initialize cell values from the matrix data
    const initialValues: {[key: string]: string} = {};
    if (skuMatrix?.rows) {
      skuMatrix.rows.forEach(row => {
        if (row.cells) {
          row.cells.forEach(cell => {
            const key = `${row.id}-${cell.columnId}`;
            initialValues[key] = cell.value || '';
          });
        }
      });
    }
    setCellValues(initialValues);
  }, [skuMatrix]);

  const handleAddRow = () => {
    if (!newRowLabel) {
      toast({
        title: "Validation Error",
        description: "Row label is required",
        variant: "destructive"
      });
      return;
    }

    // Mock adding row logic - in real implementation this would call API
    console.log('Adding row:', newRowLabel, newRowColor);
    setNewRowLabel('');
    setNewRowColor('#FFFFFF');
    
    toast({
      title: "Row Added",
      description: `Row "${newRowLabel}" has been added successfully`,
      variant: "default"
    });
  };

  const handleDeleteRow = (rowId: string) => {
    // Mock delete row logic
    console.log('Deleting row:', rowId);
    
    toast({
      title: "Row Deleted",
      description: "Row has been removed successfully",
      variant: "default"
    });
  };

  const handleAddColumn = () => {
    if (!newColumnLabel) {
      toast({
        title: "Validation Error",
        description: "Column label is required",
        variant: "destructive"
      });
      return;
    }

    const newColumn: Column = {
      id: Date.now().toString(),
      label: newColumnLabel
    };
    
    setColumns(prev => [...prev, newColumn]);
    setNewColumnLabel('');
    
    toast({
      title: "Column Added",
      description: `Column "${newColumnLabel}" has been added successfully`,
      variant: "default"
    });
  };

  const startEditingColumn = (columnId: string, label: string) => {
    setEditingColumnId(columnId);
    setEditingColumnLabel(label);
  };

  const handleUpdateColumn = () => {
    if (editingColumnId && editingColumnLabel) {
      setColumns(prev => prev.map(col => 
        col.id === editingColumnId ? { ...col, label: editingColumnLabel } : col
      ));
      setEditingColumnId(null);
      setEditingColumnLabel('');
      
      toast({
        title: "Column Updated",
        description: "Column has been updated successfully",
        variant: "default"
      });
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns(prev => prev.filter(col => col.id !== columnId));
    
    toast({
      title: "Column Deleted",
      description: "Column has been removed successfully",
      variant: "default"
    });
  };

  const startEditingRow = (rowId: string, label: string, color: string) => {
    setEditingRowId(rowId);
    setEditingRowLabel(label);
    setEditingRowColor(color);
  };

  const handleUpdateRow = () => {
    if (editingRowId) {
      console.log('Updating row:', editingRowId, editingRowLabel, editingRowColor);
      setEditingRowId(null);
      setEditingRowLabel('');
      setEditingRowColor('');
      
      toast({
        title: "Row Updated",
        description: "Row has been updated successfully",
        variant: "default"
      });
    }
  };

  const handleCellValueChange = (rowId: string, columnId: string, value: string) => {
    const key = `${rowId}-${columnId}`;
    setCellValues(prev => ({ ...prev, [key]: value }));
  };

  const getCellValue = (rowId: string, columnId: string): string => {
    const key = `${rowId}-${columnId}`;
    return cellValues[key] || '';
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      setEditingColumnId(null);
      setEditingRowId(null);
      // Save changes logic would go here
      console.log('Saving matrix changes:', cellValues);
    }
  };

  if (!skuMatrix) {
    return (
      <div className="p-4 border rounded bg-gray-50 text-center text-gray-500">
        No matrix data available.
      </div>
    );
  }

  const safeRows = Array.isArray(skuMatrix.rows) ? skuMatrix.rows : [];
  const availableBins = Array.isArray(bins) ? bins.filter(bin => bin && bin.name) : [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{skuMatrix.name}</h3>
        <div className="space-x-2">
          <Button 
            variant={editMode ? "default" : "outline"} 
            size="sm"
            onClick={toggleEditMode}
          >
            {editMode ? (
              <>
                <Save className="h-4 w-4 mr-2" /> Save
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" /> Edit
              </>
            )}
          </Button>
        </div>
      </div>

      {editMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-md">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Add Row</h4>
            <div className="flex space-x-2">
              <Input 
                placeholder="Row Label" 
                value={newRowLabel} 
                onChange={(e) => setNewRowLabel(e.target.value)}
                className="flex-1"
              />
              <Input 
                type="color" 
                value={newRowColor} 
                onChange={(e) => setNewRowColor(e.target.value)}
                className="w-16"
              />
              <Button onClick={handleAddRow} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Add Column</h4>
            <div className="flex space-x-2">
              <Input 
                placeholder="Column Label" 
                value={newColumnLabel} 
                onChange={(e) => setNewColumnLabel(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddColumn} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Row
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Color
              </th>
              {columns.map(column => (
                <th 
                  key={column.id} 
                  className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ minWidth: '150px' }}
                >
                  {editMode && editingColumnId === column.id ? (
                    <div className="flex items-center space-x-1">
                      <Input 
                        value={editingColumnLabel} 
                        onChange={(e) => setEditingColumnLabel(e.target.value)}
                        className="h-8 text-xs py-0 px-2"
                      />
                      <Button 
                        onClick={handleUpdateColumn} 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="w-full text-center">{column.label}</span>
                      {editMode && (
                        <div className="flex items-center space-x-1">
                          <Button 
                            onClick={() => startEditingColumn(column.id, column.label)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            onClick={() => handleDeleteColumn(column.id)}
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500"
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {safeRows.map((row) => (
              <tr key={row.id}>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editMode && editingRowId === row.id ? (
                    <Input 
                      value={editingRowLabel} 
                      onChange={(e) => setEditingRowLabel(e.target.value)}
                      className="h-8 text-sm py-0 px-2"
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{row.label}</span>
                      {editMode && (
                        <Button 
                          onClick={() => startEditingRow(row.id, row.label, row.color || '#FFFFFF')}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {editMode && editingRowId === row.id ? (
                    <div className="flex items-center space-x-1">
                      <Input 
                        type="color" 
                        value={editingRowColor} 
                        onChange={(e) => setEditingRowColor(e.target.value)}
                        className="w-10 h-6"
                      />
                      <Button 
                        onClick={handleUpdateRow}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                      <Button 
                        onClick={() => handleDeleteRow(row.id)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500"
                      >
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="w-8 h-6 rounded-sm border" 
                      style={{ backgroundColor: row.color || '#FFFFFF' }}
                    ></div>
                  )}
                </td>
                {columns.map(column => {
                  const cellValue = getCellValue(row.id, column.id);
                  
                  return (
                    <td 
                      key={`${row.id}-${column.id}`} 
                      className="px-3 py-2"
                    >
                      {editMode ? (
                        <Select 
                          value={cellValue} 
                          onValueChange={(value) => handleCellValueChange(row.id, column.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select bin..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">No bin</SelectItem>
                            {availableBins.map((bin) => (
                              <SelectItem key={bin.id} value={bin.name}>
                                {bin.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="w-full h-full">
                          <div 
                            className={`p-2 text-center w-full rounded-md ${
                              cellValue ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {cellValue || 'Empty'}
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnhancedSkuMatrixTable;
