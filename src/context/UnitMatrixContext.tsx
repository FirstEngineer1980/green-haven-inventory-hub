import React, { createContext, useState, useContext } from 'react';
import { UnitMatrix, UnitMatrixRow, UnitMatrixColumn, UnitMatrixCell, Room } from '../types';
import { useNotifications } from './NotificationContext';
import { useRooms } from './RoomContext';
import { useBins } from './BinContext';

// Mock column data
const mockColumns: UnitMatrixColumn[] = [
  { id: 'bin1', label: 'Bin1' },
  { id: 'bin2', label: 'Bin2' },
  { id: 'bin3', label: 'Bin3' },
  { id: 'bin4', label: 'Bin4' },
  { id: 'bin5', label: 'Bin5' }
];

// Mock unit matrix data
const mockUnitMatrix: UnitMatrix[] = [
  {
    id: '1',
    roomId: '1',
    roomName: 'Storage Room A',
    name: 'UnitA',
    rows: [
      {
        id: 'shelf1',
        label: 'Shelf1',
        color: '#FF0000',
        cells: [
          { id: 'shelf1-bin1', value: 'SKU18', columnId: 'bin1' },
          { id: 'shelf1-bin2', value: 'SKU2', columnId: 'bin2' },
          { id: 'shelf1-bin3', value: 'SKU3', columnId: 'bin3' },
          { id: 'shelf1-bin4', value: 'SKU4', columnId: 'bin4' },
          { id: 'shelf1-bin5', value: 'SKU5', columnId: 'bin5' }
        ]
      },
      {
        id: 'shelf2',
        label: 'Shelf2',
        color: '#3498db',
        cells: [
          { id: 'shelf2-bin1', value: 'SKU6', columnId: 'bin1' },
          { id: 'shelf2-bin2', value: 'SKU7', columnId: 'bin2' },
          { id: 'shelf2-bin3', value: 'SKU8', columnId: 'bin3' },
          { id: 'shelf2-bin4', value: 'SKU9', columnId: 'bin4' },
          { id: 'shelf2-bin5', value: 'SKU10', columnId: 'bin5' }
        ]
      },
      {
        id: 'shelf3',
        label: 'Shelf3',
        color: '#f1c40f',
        cells: [
          { id: 'shelf3-bin1', value: 'SKU11', columnId: 'bin1' },
          { id: 'shelf3-bin2', value: 'SKU12', columnId: 'bin2' },
          { id: 'shelf3-bin3', value: 'SKU13', columnId: 'bin3' },
          { id: 'shelf3-bin4', value: 'SKU14', columnId: 'bin4' },
          { id: 'shelf3-bin5', value: '', columnId: 'bin5' }
        ]
      },
      {
        id: 'shelf4',
        label: 'Shelf4',
        color: '#2ecc71',
        cells: [
          { id: 'shelf4-bin1', value: 'SKU16', columnId: 'bin1' },
          { id: 'shelf4-bin2', value: 'SKU17', columnId: 'bin2' },
          { id: 'shelf4-bin3', value: '', columnId: 'bin3' },
          { id: 'shelf4-bin4', value: '', columnId: 'bin4' },
          { id: 'shelf4-bin5', value: '', columnId: 'bin5' }
        ]
      },
      {
        id: 'shelf5',
        label: 'Shelf5',
        color: '#ffff00',
        cells: [
          { id: 'shelf5-bin1', value: 'SKU17', columnId: 'bin1' },
          { id: 'shelf5-bin2', value: 'SKU18', columnId: 'bin2' },
          { id: 'shelf5-bin3', value: 'SKU19', columnId: 'bin3' },
          { id: 'shelf5-bin4', value: '', columnId: 'bin4' },
          { id: 'shelf5-bin5', value: '', columnId: 'bin5' }
        ]
      }
    ],
    createdAt: '2023-05-15T09:30:00Z',
    updatedAt: '2023-08-25T11:45:00Z'
  }
];

interface UnitMatrixContextType {
  unitMatrices: UnitMatrix[];
  columns: UnitMatrixColumn[];
  addUnitMatrix: (unitMatrix: Omit<UnitMatrix, 'id' | 'roomName' | 'createdAt' | 'updatedAt'>) => void;
  updateUnitMatrix: (id: string, updates: Partial<UnitMatrix>) => void;
  deleteUnitMatrix: (id: string) => void;
  getUnitMatrixByRoomId: (roomId: string) => UnitMatrix[];
  addColumn: (label: string, binId?: string, width?: number) => void;
  updateColumn: (id: string, label: string, binId?: string, width?: number) => void;
  deleteColumn: (id: string) => void;
  addRow: (unitMatrixId: string, label: string, color: string) => void;
  updateRow: (unitMatrixId: string, rowId: string, updates: Partial<UnitMatrixRow>) => void;
  deleteRow: (unitMatrixId: string, rowId: string) => void;
  updateCell: (unitMatrixId: string, rowId: string, columnId: string, value: string) => void;
}

const UnitMatrixContext = createContext<UnitMatrixContextType>({} as UnitMatrixContextType);

export const useUnitMatrix = () => useContext(UnitMatrixContext);

export const UnitMatrixProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unitMatrices, setUnitMatrices] = useState<UnitMatrix[]>(mockUnitMatrix);
  const [columns, setColumns] = useState<UnitMatrixColumn[]>(mockColumns);
  const { addNotification } = useNotifications();
  const { rooms } = useRooms();
  const { bins } = useBins();

  const getRoomName = (roomId: string): string => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Unknown Room';
  };

  const addUnitMatrix = (unitMatrix: Omit<UnitMatrix, 'id' | 'roomName' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const roomName = getRoomName(unitMatrix.roomId);
    
    // Ensure rows have cells based on existing columns
    const rowsWithCells = unitMatrix.rows.map(row => {
      // If cells are not provided, create them
      if (!row.cells || row.cells.length === 0) {
        const cellsForRow = columns.map(column => ({
          id: `${row.id}-${column.id}`,
          value: '',
          columnId: column.id
        }));
        
        return {
          ...row,
          cells: cellsForRow
        };
      }
      
      return row;
    });
    
    const newUnitMatrix: UnitMatrix = {
      ...unitMatrix,
      id: Date.now().toString(),
      roomName,
      rows: rowsWithCells,
      createdAt: now,
      updatedAt: now
    };
    
    setUnitMatrices(prev => [...prev, newUnitMatrix]);
    
    // Send notification about new unit matrix
    addNotification({
      title: 'New Unit Matrix Added',
      message: `Unit Matrix "${newUnitMatrix.name}" has been added to ${roomName}`,
      type: 'info',
      for: ['1', '2'], // Admin, Manager
    });
  };

  const updateUnitMatrix = (id: string, updates: Partial<UnitMatrix>) => {
    setUnitMatrices(prev => 
      prev.map(unitMatrix => 
        unitMatrix.id === id 
          ? { 
              ...unitMatrix, 
              ...updates, 
              roomName: updates.roomId ? getRoomName(updates.roomId) : unitMatrix.roomName,
              updatedAt: new Date().toISOString() 
            } 
          : unitMatrix
      )
    );
    
    // Get the updated unit matrix
    const updatedUnitMatrix = unitMatrices.find(u => u.id === id);
    if (updatedUnitMatrix) {
      // Send notification about update
      addNotification({
        title: 'Unit Matrix Updated',
        message: `Unit Matrix "${updatedUnitMatrix.name}" has been updated`,
        type: 'success',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

  const deleteUnitMatrix = (id: string) => {
    // Get the unit matrix before deleting
    const unitMatrixToDelete = unitMatrices.find(u => u.id === id);
    
    setUnitMatrices(prev => prev.filter(unitMatrix => unitMatrix.id !== id));
    
    if (unitMatrixToDelete) {
      addNotification({
        title: 'Unit Matrix Deleted',
        message: `Unit Matrix "${unitMatrixToDelete.name}" has been removed from ${unitMatrixToDelete.roomName}`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager
      });
    }
  };

  const getUnitMatrixByRoomId = (roomId: string): UnitMatrix[] => {
    return unitMatrices.filter(unitMatrix => unitMatrix.roomId === roomId);
  };

  const addColumn = (label: string, binId?: string, width?: number) => {
    const newColumn: UnitMatrixColumn = {
      id: `column-${Date.now()}`,
      label,
      binId,
      width
    };
    
    setColumns(prev => [...prev, newColumn]);
    
    // Add empty cells for the new column to all rows in all matrices
    setUnitMatrices(prev => 
      prev.map(unitMatrix => ({
        ...unitMatrix,
        rows: unitMatrix.rows.map(row => ({
          ...row,
          cells: [
            ...row.cells,
            {
              id: `${row.id}-${newColumn.id}`,
              value: '',
              columnId: newColumn.id
            }
          ]
        })),
        updatedAt: new Date().toISOString()
      }))
    );
  };

  const updateColumn = (id: string, label: string, binId?: string, width?: number) => {
    setColumns(prev => 
      prev.map(column => 
        column.id === id 
          ? { ...column, label, binId, width } 
          : column
      )
    );
  };

  const deleteColumn = (id: string) => {
    setColumns(prev => prev.filter(column => column.id !== id));
    
    // Remove cells for the deleted column from all rows in all matrices
    setUnitMatrices(prev => 
      prev.map(unitMatrix => ({
        ...unitMatrix,
        rows: unitMatrix.rows.map(row => ({
          ...row,
          cells: row.cells.filter(cell => cell.columnId !== id)
        })),
        updatedAt: new Date().toISOString()
      }))
    );
  };

  const addRow = (unitMatrixId: string, label: string, color: string) => {
    const rowId = `row-${Date.now()}`;
    
    // Create cells for the new row based on existing columns
    const cellsForRow = columns.map(column => ({
      id: `${rowId}-${column.id}`,
      value: '',
      columnId: column.id
    }));
    
    setUnitMatrices(prev => 
      prev.map(unitMatrix => 
        unitMatrix.id === unitMatrixId 
          ? {
              ...unitMatrix,
              rows: [
                ...unitMatrix.rows,
                {
                  id: rowId,
                  label,
                  color,
                  cells: cellsForRow
                }
              ],
              updatedAt: new Date().toISOString()
            }
          : unitMatrix
      )
    );
  };

  const updateRow = (unitMatrixId: string, rowId: string, updates: Partial<UnitMatrixRow>) => {
    setUnitMatrices(prev => 
      prev.map(unitMatrix => 
        unitMatrix.id === unitMatrixId 
          ? {
              ...unitMatrix,
              rows: unitMatrix.rows.map(row => 
                row.id === rowId 
                  ? { ...row, ...updates } 
                  : row
              ),
              updatedAt: new Date().toISOString()
            }
          : unitMatrix
      )
    );
  };

  const deleteRow = (unitMatrixId: string, rowId: string) => {
    setUnitMatrices(prev => 
      prev.map(unitMatrix => 
        unitMatrix.id === unitMatrixId 
          ? {
              ...unitMatrix,
              rows: unitMatrix.rows.filter(row => row.id !== rowId),
              updatedAt: new Date().toISOString()
            }
          : unitMatrix
      )
    );
  };

  const updateCell = (unitMatrixId: string, rowId: string, columnId: string, value: string) => {
    setUnitMatrices(prev => 
      prev.map(unitMatrix => 
        unitMatrix.id === unitMatrixId 
          ? {
              ...unitMatrix,
              rows: unitMatrix.rows.map(row => 
                row.id === rowId 
                  ? {
                      ...row,
                      cells: row.cells.map(cell => 
                        cell.columnId === columnId 
                          ? { ...cell, value } 
                          : cell
                      )
                    } 
                  : row
              ),
              updatedAt: new Date().toISOString()
            }
          : unitMatrix
      )
    );
  };

  return (
    <UnitMatrixContext.Provider value={{ 
      unitMatrices, 
      columns,
      addUnitMatrix, 
      updateUnitMatrix, 
      deleteUnitMatrix,
      getUnitMatrixByRoomId,
      addColumn,
      updateColumn,
      deleteColumn,
      addRow,
      updateRow,
      deleteRow,
      updateCell
    }}>
      {children}
    </UnitMatrixContext.Provider>
  );
};
