
import React, { useState } from 'react';
import { UnitMatrix } from '@/types';
import { useUnitMatrix } from '@/context/UnitMatrixContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Save, Edit, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SkuMatrixTableProps {
  unitMatrix: UnitMatrix;
}

const SkuMatrixTable = ({ unitMatrix }: SkuMatrixTableProps) => {
  const { columns, updateCell, addRow, deleteRow, updateRow, addColumn, deleteColumn, updateColumn } = useUnitMatrix();
  const [editMode, setEditMode] = useState(false);
  const [tempCells, setTempCells] = useState<{[key: string]: string}>({});
  const [newRowLabel, setNewRowLabel] = useState('');
  const [newRowColor, setNewRowColor] = useState('#FFFFFF');
  const [newColumnLabel, setNewColumnLabel] = useState('');
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnLabel, setEditingColumnLabel] = useState('');
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingRowColor, setEditingRowColor] = useState('');
  const { toast } = useToast();

  const handleCellChange = (rowId: string, columnId: string, value: string) => {
    const cellKey = `${rowId}-${columnId}`;
    setTempCells(prev => ({
      ...prev,
      [cellKey]: value
    }));
  };

  const startEditing = () => {
    // Initialize tempCells with current values
    const initialTempCells: {[key: string]: string} = {};
    unitMatrix.rows.forEach(row => {
      row.cells.forEach(cell => {
        initialTempCells[`${row.id}-${cell.columnId}`] = cell.value;
      });
    });
    setTempCells(initialTempCells);
    setEditMode(true);
  };

  const saveChanges = () => {
    // Apply all cell changes
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

    addRow(unitMatrix.id, newRowLabel, newRowColor);
    setNewRowLabel('');
    setNewRowColor('#FFFFFF');
  };

  const handleDeleteRow = (rowId: string) => {
    deleteRow(unitMatrix.id, rowId);
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

    addColumn(newColumnLabel);
    setNewColumnLabel('');
  };

  const startEditingColumn = (columnId: string, label: string) => {
    setEditingColumnId(columnId);
    setEditingColumnLabel(label);
  };

  const handleUpdateColumn = () => {
    if (editingColumnId && editingColumnLabel) {
      updateColumn(editingColumnId, editingColumnLabel);
      setEditingColumnId(null);
      setEditingColumnLabel('');
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
    if (editingRowId && editingRowColor) {
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
    
    const row = unitMatrix.rows.find(r => r.id === rowId);
    if (!row) return '';
    
    const cell = row.cells.find(c => c.columnId === columnId);
    return cell ? cell.value : '';
  };

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

      <div className="overflow-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                Unit
              </th>
              {columns.map(column => (
                <th key={column.id} className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                  {editMode && editingColumnId === column.id ? (
                    <div className="flex items-center space-x-1">
                      <Input 
                        value={editingColumnLabel} 
                        onChange={(e) => setEditingColumnLabel(e.target.value)}
                        className="h-6 text-xs py-0 px-1"
                      />
                      <Button onClick={handleUpdateColumn} size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Save className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span>{column.label}</span>
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
            {unitMatrix.rows.map((row) => (
              <tr key={row.id}>
                <td 
                  className="px-4 py-2 whitespace-nowrap border-r" 
                  style={{ backgroundColor: row.color }}
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
                            onClick={() => startEditingRowColor(row.id, row.color)}
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
                {columns.map(column => {
                  const value = getCellValue(row.id, column.id);
                  return (
                    <td 
                      key={`${row.id}-${column.id}`} 
                      className={`px-4 py-2 whitespace-nowrap border-r ${!value && !editMode ? 'bg-gray-200' : ''}`}
                    >
                      {editMode ? (
                        <Input 
                          value={value}
                          onChange={(e) => handleCellChange(row.id, column.id, e.target.value)}
                          className="h-8 py-1 px-2 text-sm"
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
