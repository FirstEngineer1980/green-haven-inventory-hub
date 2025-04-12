import React, { useState, useEffect, useRef } from 'react';
import { UnitMatrix, UnitMatrixRow, UnitMatrixCell, Bin } from '@/types';
import { useUnitMatrix } from '@/context/UnitMatrixContext';
import { useBins } from '@/context/BinContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Save, Edit, Trash, ChevronsUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface FlexibleUnitMatrixProps {
  unitMatrix: UnitMatrix;
  onEdit?: (unitMatrix: UnitMatrix) => void;
  onDelete?: (id: string) => void;
}

const FlexibleUnitMatrix = ({ unitMatrix, onEdit, onDelete }: FlexibleUnitMatrixProps) => {
  const { 
    columns, 
    updateCell, 
    addRow, 
    deleteRow, 
    updateRow, 
    addColumn, 
    deleteColumn, 
    updateColumn 
  } = useUnitMatrix();
  const { bins } = useBins();
  const { toast } = useToast();

  const [editMode, setEditMode] = useState(false);
  const [newRowLabel, setNewRowLabel] = useState('');
  const [newRowColor, setNewRowColor] = useState('#FFFF00');
  const [newColumnLabel, setNewColumnLabel] = useState('');
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [editingColumnLabel, setEditingColumnLabel] = useState('');
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingRowLabel, setEditingRowLabel] = useState('');
  const [editingRowColor, setEditingRowColor] = useState('');
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null);
  const [selectedBin, setSelectedBin] = useState<string>('');
  const [availableBins, setAvailableBins] = useState<Bin[]>([]);
  const [binOptions, setBinOptions] = useState<string[]>([]);
  
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const validBins = Array.isArray(bins) ? bins.filter(bin => !!bin) : [];
      setAvailableBins(validBins);
      
      const binNames = validBins.map(bin => bin.name || '').filter(name => name !== '');
      setBinOptions(binNames.length > 0 ? binNames : []);
      
      console.log("Available bins:", validBins);
      console.log("Bin options for dropdown:", binNames);
    } catch (error) {
      console.error("Error processing bins:", error);
      setAvailableBins([]);
      setBinOptions([]);
    }
  }, [bins]);

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
    setNewRowColor('#FFFF00');
    
    toast({
      title: "Row Added",
      description: `Row "${newRowLabel}" has been added successfully`,
      variant: "default"
    });
  };

  const handleDeleteRow = (rowId: string) => {
    deleteRow(unitMatrix.id, rowId);
    
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

    addColumn(newColumnLabel);
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
      updateColumn(editingColumnId, editingColumnLabel);
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
    deleteColumn(columnId);
    
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
      updateRow(unitMatrix.id, editingRowId, { 
        label: editingRowLabel,
        color: editingRowColor 
      });
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

  const startEditingCell = (rowId: string, columnId: string) => {
    setEditingCell({ rowId, columnId });
    
    const row = unitMatrix.rows?.find(r => r.id === rowId);
    if (row) {
      const cell = row.cells?.find(c => c.columnId === columnId);
      if (cell) {
        setSelectedBin(cell.value);
      } else {
        setSelectedBin('');
      }
    }
  };

  const handleCellUpdate = (bin: string) => {
    if (editingCell) {
      updateCell(unitMatrix.id, editingCell.rowId, editingCell.columnId, bin);
      setEditingCell(null);
      setSelectedBin('');
      
      toast({
        title: "Cell Updated",
        description: "Cell value has been updated successfully",
        variant: "default"
      });
    }
  };

  const getCellValue = (rowId: string, columnId: string): string => {
    const row = unitMatrix.rows?.find(r => r.id === rowId);
    if (!row) return '';
    
    const cell = row.cells?.find(c => c.columnId === columnId);
    return cell ? cell.value : '';
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      setEditingColumnId(null);
      setEditingRowId(null);
      setEditingCell(null);
    }
  };

  if (!unitMatrix || !unitMatrix.rows) {
    return (
      <div className="p-4 border rounded bg-gray-50 text-center text-gray-500">
        Invalid matrix data. Please check the data structure.
      </div>
    );
  }

  return (
    <div className="space-y-4" ref={tableRef}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{unitMatrix.name} - {unitMatrix.roomName}</h3>
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
          {onDelete && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => onDelete(unitMatrix.id)}
            >
              <Trash className="h-4 w-4 mr-2" /> Delete
            </Button>
          )}
        </div>
      </div>

      {editMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-md">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Add Row</h4>
            <div className="flex space-x-2">
              <Input 
                placeholder="Shelf Label" 
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
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24 md:w-32">
                Shelf
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16 md:w-20">
                Color
              </th>
              {Array.isArray(columns) && columns.map(column => (
                <th 
                  key={column.id} 
                  className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ minWidth: '100px' }}
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
                        <div className="flex items-center space-x-1 absolute right-1">
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
            {Array.isArray(unitMatrix.rows) && unitMatrix.rows.map((row) => (
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
                <td 
                  className="px-3 py-2 whitespace-nowrap" 
                >
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
                      {editMode && (
                        <Button 
                          onClick={() => handleDeleteRow(row.id)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div 
                      className="w-8 h-6 rounded-sm" 
                      style={{ backgroundColor: row.color || '#FFFFFF' }}
                    ></div>
                  )}
                </td>
                {Array.isArray(columns) && columns.map(column => {
                  const cellValue = getCellValue(row.id, column.id);
                  const isEditing = editingCell && 
                                    editingCell.rowId === row.id && 
                                    editingCell.columnId === column.id;
                  
                  return (
                    <td 
                      key={`${row.id}-${column.id}`} 
                      className={cn(
                        "px-3 py-2 relative",
                        !cellValue && !editMode ? 'bg-gray-50' : '',
                        editMode && 'cursor-pointer hover:bg-gray-100'
                      )}
                      style={{ 
                        maxWidth: '180px',
                        position: 'relative'
                      }}
                      onClick={() => editMode && startEditingCell(row.id, column.id)}
                    >
                      {isEditing ? (
                        <Popover open={true} onOpenChange={() => setEditingCell(null)}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                            >
                              {selectedBin || "Select bin..."}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search bins..." />
                              <CommandEmpty>
                                {binOptions.length === 0 ? "No bins available" : "No bin found"}
                              </CommandEmpty>
                              <CommandGroup className="max-h-[200px] overflow-y-auto">
                                {binOptions && binOptions.length > 0 ? (
                                  binOptions.map((binName) => (
                                    <CommandItem
                                      key={binName}
                                      value={binName}
                                      onSelect={() => handleCellUpdate(binName)}
                                    >
                                      {binName}
                                    </CommandItem>
                                  ))
                                ) : (
                                  <CommandItem disabled>No bins available</CommandItem>
                                )}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <div className="w-full h-full">
                          <div 
                            className={`p-1 text-center w-full overflow-hidden text-ellipsis ${
                              cellValue ? 'bg-blue-500 text-white rounded-md' : ''
                            }`}
                          >
                            {cellValue}
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

export default FlexibleUnitMatrix;
