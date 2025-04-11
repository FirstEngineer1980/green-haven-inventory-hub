
import React, { useState, useEffect } from 'react';
import { UnitMatrix } from '@/types';
import { useUnitMatrix } from '@/context/UnitMatrixContext';
import { useBins } from '@/context/BinContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Save, Edit, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ComboboxCell from './components/ComboboxCell';

interface SkuMatrixTableProps {
  unitMatrix: UnitMatrix;
}

const SkuMatrixTable = ({ unitMatrix }: SkuMatrixTableProps) => {
  const { columns = [], updateCell, addRow, deleteRow, updateRow, addColumn, deleteColumn, updateColumn, unitMatrices = [] } = useUnitMatrix();
  const { bins = [] } = useBins();
  const [editMode, setEditMode] = useState(false);
  const [tempCells, setTempCells] = useState<{[key: string]: string}>({});
  const [newRowLabel, setNewRowLabel] = useState('');
  const [newRowColor, setNewRowColor] = useState('#FFFFFF');
  const [newColumnLabel, setNewColumnLabel] = useState('');
  const [selectedBinId, setSelectedBinId] = useState('');
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnLabel, setEditingColumnLabel] = useState('');
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingRowColor, setEditingRowColor] = useState('');
  const [skuOptions, setSkuOptions] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const options = new Set<string>();
      
      if (Array.isArray(unitMatrices)) {
        unitMatrices.forEach(matrix => {
          if (matrix && Array.isArray(matrix.rows)) {
            matrix.rows.forEach(row => {
              if (row && Array.isArray(row.cells)) {
                row.cells.forEach(cell => {
                  if (cell && cell.value && cell.value.trim() !== '') {
                    options.add(cell.value);
                  }
                });
              }
            });
          }
        });
      }
      
      setSkuOptions(Array.from(options || new Set<string>()));
    } catch (error) {
      console.error("Error collecting SKU options:", error);
      setSkuOptions([]);
    }
  }, [unitMatrices]);

  const handleCellChange = (rowId: string, columnId: string, value: string) => {
    const cellKey = `${rowId}-${columnId}`;
    setTempCells(prev => ({
      ...prev,
      [cellKey]: value
    }));
  };

  const startEditing = () => {
    const initialTempCells: {[key: string]: string} = {};
    if (unitMatrix && Array.isArray(unitMatrix.rows)) {
      unitMatrix.rows.forEach(row => {
        if (row && Array.isArray(row.cells)) {
          row.cells.forEach(cell => {
            initialTempCells[`${row.id}-${cell.columnId}`] = cell.value || '';
          });
        }
      });
    }
    setTempCells(initialTempCells);
    setEditMode(true);
  };

  const saveChanges = () => {
    if (unitMatrix && unitMatrix.id) {
      Object.entries(tempCells).forEach(([key, value]) => {
        const [rowId, columnId] = key.split('-');
        updateCell(unitMatrix.id, rowId, columnId, value);
      });
  
      setEditMode(false);
      setTempCells({});
      
      toast({
        title: "Changes Saved",
        description: "SKU matrix has been updated successfully",
        variant: "default"
      });
    }
  };

  const cancelEditing = () => {
    setEditMode(false);
    setTempCells({});
    setEditingRowId(null);
  };

  const handleAddRow = () => {
    if (!newRowLabel) {
      toast({
        title: "Validation Error",
        description: "Row label is required",
        variant: "destructive"
      });
      return;
    }

    if (unitMatrix && unitMatrix.id) {
      addRow(unitMatrix.id, newRowLabel, newRowColor);
      setNewRowLabel('');
      setNewRowColor('#FFFFFF');
    }
  };

  const handleDeleteRow = (rowId: string) => {
    if (unitMatrix && unitMatrix.id) {
      deleteRow(unitMatrix.id, rowId);
    }
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

    const selectedBin = selectedBinId ? bins.find(bin => bin.id === selectedBinId) : null;
    const binWidth = selectedBin ? selectedBin.width : undefined;
    
    addColumn(newColumnLabel, selectedBinId, binWidth);
    setNewColumnLabel('');
    setSelectedBinId('');
    
    toast({
      title: "Column Added",
      description: `Column "${newColumnLabel}" added successfully`,
      variant: "default"
    });
  };

  const startEditingColumn = (columnId: string, label: string) => {
    const column = columns.find(c => c.id === columnId);
    setEditingColumnId(columnId);
    setEditingColumnLabel(label);
    setSelectedBinId(column?.binId || '');
  };

  const handleUpdateColumn = () => {
    if (editingColumnId && editingColumnLabel) {
      const selectedBin = selectedBinId ? bins.find(bin => bin.id === selectedBinId) : null;
      const binWidth = selectedBin ? selectedBin.width : undefined;
      
      updateColumn(editingColumnId, editingColumnLabel, selectedBinId, binWidth);
      setEditingColumnId(null);
      setEditingColumnLabel('');
      setSelectedBinId('');
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    deleteColumn(columnId);
  };

  const startEditingRowColor = (rowId: string, currentColor: string) => {
    setEditingRowId(rowId);
    setEditingRowColor(currentColor);
  };

  const handleUpdateRowColor = (rowId: string) => {
    if (editingRowId && editingRowColor && unitMatrix && unitMatrix.id) {
      updateRow(unitMatrix.id, rowId, { color: editingRowColor });
      setEditingRowId(null);
      setEditingRowColor('');
    }
  };

  const getCellValue = (rowId: string, columnId: string) => {
    const cellKey = `${rowId}-${columnId}`;
    if (editMode && cellKey in tempCells) {
      return tempCells[cellKey];
    }
    
    if (!unitMatrix || !Array.isArray(unitMatrix.rows)) {
      return '';
    }
    
    const row = unitMatrix.rows.find(r => r.id === rowId);
    if (!row || !Array.isArray(row.cells)) return '';
    
    const cell = row.cells.find(c => c.columnId === columnId);
    return cell ? cell.value : '';
  };

  const getColumnStyle = (columnId: string) => {
    const column = columns.find(c => c.id === columnId);
    if (column?.width) {
      return {
        width: `${column.width * 10}px`,
        minWidth: '100px'
      };
    }
    return { minWidth: '100px' };
  };

  if (!unitMatrix || !unitMatrix.rows) {
    return (
      <div className="p-4 border rounded bg-gray-50 text-center text-gray-500">
        Invalid matrix data. Please check the data structure.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        {!editMode ? (
          <Button onClick={startEditing} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" /> Edit
          </Button>
        ) : (
          <div className="space-x-2">
            <Button onClick={saveChanges} variant="default" size="sm">
              <Save className="h-4 w-4 mr-2" /> Save
            </Button>
            <Button onClick={cancelEditing} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          </div>
        )}
      </div>

      {editMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
            <div className="flex flex-col space-y-2">
              <Input 
                placeholder="Column Label" 
                value={newColumnLabel} 
                onChange={(e) => setNewColumnLabel(e.target.value)}
                className="w-full"
              />
              <div className="flex space-x-2">
                <Select value={selectedBinId} onValueChange={setSelectedBinId}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a bin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No bin</SelectItem>
                    {Array.isArray(bins) && bins.map(bin => (
                      <SelectItem key={bin.id} value={bin.id}>
                        {bin.name} ({bin.width}cm)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddColumn} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                Unit
              </th>
              {Array.isArray(columns) && columns.map(column => (
                <th 
                  key={column.id} 
                  className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r"
                  style={getColumnStyle(column.id)}
                >
                  {editMode && editingColumnId === column.id ? (
                    <div className="flex flex-col space-y-2">
                      <Input 
                        value={editingColumnLabel} 
                        onChange={(e) => setEditingColumnLabel(e.target.value)}
                        className="h-6 text-xs py-0 px-1"
                      />
                      <Select value={selectedBinId} onValueChange={setSelectedBinId}>
                        <SelectTrigger className="h-6 text-xs py-0 px-1">
                          <SelectValue placeholder="Select bin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No bin</SelectItem>
                          {Array.isArray(bins) && bins.map(bin => (
                            <SelectItem key={bin.id} value={bin.id}>
                              {bin.name} ({bin.width}cm)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleUpdateColumn} size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Save className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span>{column.label}</span>
                        {column.binId && bins && Array.isArray(bins) && bins.find(b => b.id === column.binId) && (
                          <span className="text-xs text-gray-400">
                            {bins.find(b => b.id === column.binId)?.name} 
                            ({bins.find(b => b.id === column.binId)?.width}cm)
                          </span>
                        )}
                      </div>
                      {editMode && (
                        <div className="flex items-center space-x-1">
                          <Button 
                            onClick={() => startEditingColumn(column.id, column.label)}
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            onClick={() => handleDeleteColumn(column.id)}
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-red-500"
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
            {unitMatrix && Array.isArray(unitMatrix.rows) && unitMatrix.rows.map((row) => (
              <tr key={row.id}>
                <td 
                  className="px-4 py-2 whitespace-nowrap border-r" 
                  style={{ backgroundColor: row.color || '#FFFFFF' }}
                >
                  {editMode && editingRowId === row.id ? (
                    <div className="flex items-center space-x-1">
                      <span className="font-medium text-white">{row.label}</span>
                      <Input 
                        type="color" 
                        value={editingRowColor} 
                        onChange={(e) => setEditingRowColor(e.target.value)}
                        className="w-8 h-5 ml-2"
                      />
                      <Button 
                        onClick={() => handleUpdateRowColor(row.id)}
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 text-white hover:bg-white/20"
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{row.label}</span>
                      {editMode && (
                        <div className="flex items-center space-x-1">
                          <Button 
                            onClick={() => startEditingRowColor(row.id, row.color || '#FFFFFF')}
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-white hover:bg-white/20"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            onClick={() => handleDeleteRow(row.id)}
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-white hover:bg-white/20"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </td>
                {Array.isArray(columns) && columns.map(column => {
                  const value = getCellValue(row.id, column.id);
                  return (
                    <td 
                      key={`${row.id}-${column.id}`} 
                      className={`px-4 py-2 whitespace-nowrap border-r ${!value && !editMode ? 'bg-gray-200' : ''}`}
                      style={getColumnStyle(column.id)}
                    >
                      {editMode ? (
                        <ComboboxCell
                          value={value || ''}
                          onChange={(newValue) => handleCellChange(row.id, column.id, newValue)}
                          options={skuOptions || []}
                          placeholder="Select or add SKU"
                        />
                      ) : (
                        value
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

export default SkuMatrixTable;
