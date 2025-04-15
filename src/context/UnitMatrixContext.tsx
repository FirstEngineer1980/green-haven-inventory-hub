
import React, { createContext, useState, useContext } from 'react';
import { UnitMatrix, UnitMatrixRow, UnitMatrixCell } from '../types';
import { useRooms } from './RoomContext';
import { useNotifications } from './NotificationContext';

// Column type definition for the matrix
interface UnitMatrixColumn {
  id: string;
  label: string;
}

// Mock data for columns
const mockColumns: UnitMatrixColumn[] = [
  { id: 'col-1', label: 'Column 1' },
  { id: 'col-2', label: 'Column 2' },
  { id: 'col-3', label: 'Column 3' },
  { id: 'col-4', label: 'Column 4' },
  { id: 'col-5', label: 'Column 5' },
];

// Mock data for unit matrices
const mockUnitMatrices: UnitMatrix[] = [
  {
    id: '1',
    name: 'SKU Matrix 1',
    roomId: '1',
    roomName: 'Storage Room A',
    rows: [
      {
        id: 'row-1',
        label: 'A',
        color: '#FF5722',
        cells: [
          { id: 'cell-1-1', rowId: 'row-1', columnId: 'col-1', content: 'SKU-001' },
          { id: 'cell-1-2', rowId: 'row-1', columnId: 'col-2', content: 'SKU-002' },
          { id: 'cell-1-3', rowId: 'row-1', columnId: 'col-3', content: 'SKU-003' },
          { id: 'cell-1-4', rowId: 'row-1', columnId: 'col-4', content: 'SKU-004' },
          { id: 'cell-1-5', rowId: 'row-1', columnId: 'col-5', content: 'SKU-005' },
        ]
      },
      {
        id: 'row-2',
        label: 'B',
        color: '#4CAF50',
        cells: [
          { id: 'cell-2-1', rowId: 'row-2', columnId: 'col-1', content: 'SKU-101' },
          { id: 'cell-2-2', rowId: 'row-2', columnId: 'col-2', content: 'SKU-102' },
          { id: 'cell-2-3', rowId: 'row-2', columnId: 'col-3', content: 'SKU-103' },
          { id: 'cell-2-4', rowId: 'row-2', columnId: 'col-4', content: 'SKU-104' },
          { id: 'cell-2-5', rowId: 'row-2', columnId: 'col-5', content: 'SKU-105' },
        ]
      },
      {
        id: 'row-3',
        label: 'C',
        color: '#2196F3',
        cells: [
          { id: 'cell-3-1', rowId: 'row-3', columnId: 'col-1', content: 'SKU-201' },
          { id: 'cell-3-2', rowId: 'row-3', columnId: 'col-2', content: 'SKU-202' },
          { id: 'cell-3-3', rowId: 'row-3', columnId: 'col-3', content: 'SKU-203' },
          { id: 'cell-3-4', rowId: 'row-3', columnId: 'col-4', content: 'SKU-204' },
          { id: 'cell-3-5', rowId: 'row-3', columnId: 'col-5', content: 'SKU-205' },
        ]
      }
    ],
    createdAt: '2023-05-10T14:30:00Z',
    updatedAt: '2023-09-15T09:45:00Z'
  },
  {
    id: '2',
    name: 'SKU Matrix 2',
    roomId: '2',
    roomName: 'Warehouse Space',
    rows: [
      {
        id: 'row-4',
        label: 'X',
        color: '#9C27B0',
        cells: [
          { id: 'cell-4-1', rowId: 'row-4', columnId: 'col-1', content: 'SKU-301' },
          { id: 'cell-4-2', rowId: 'row-4', columnId: 'col-2', content: 'SKU-302' },
          { id: 'cell-4-3', rowId: 'row-4', columnId: 'col-3', content: 'SKU-303' },
          { id: 'cell-4-4', rowId: 'row-4', columnId: 'col-4', content: 'SKU-304' },
          { id: 'cell-4-5', rowId: 'row-4', columnId: 'col-5', content: 'SKU-305' },
        ]
      },
      {
        id: 'row-5',
        label: 'Y',
        color: '#E91E63',
        cells: [
          { id: 'cell-5-1', rowId: 'row-5', columnId: 'col-1', content: 'SKU-401' },
          { id: 'cell-5-2', rowId: 'row-5', columnId: 'col-2', content: 'SKU-402' },
          { id: 'cell-5-3', rowId: 'row-5', columnId: 'col-3', content: 'SKU-403' },
          { id: 'cell-5-4', rowId: 'row-5', columnId: 'col-4', content: 'SKU-404' },
          { id: 'cell-5-5', rowId: 'row-5', columnId: 'col-5', content: 'SKU-405' },
        ]
      }
    ],
    createdAt: '2023-06-20T11:15:00Z',
    updatedAt: '2023-08-30T16:20:00Z'
  }
];

interface UnitMatrixContextType {
  unitMatrices: UnitMatrix[];
  columns: UnitMatrixColumn[];
  addUnitMatrix: (matrix: Omit<UnitMatrix, 'id' | 'createdAt' | 'updatedAt' | 'roomName'>) => void;
  updateUnitMatrix: (id: string, updates: Partial<UnitMatrix>) => void;
  deleteUnitMatrix: (id: string) => void;
  addRow: (unitMatrixId: string, label: string, color: string) => void;
  updateRow: (unitMatrixId: string, rowId: string, updates: Partial<UnitMatrixRow>) => void;
  deleteRow: (unitMatrixId: string, rowId: string) => void;
  updateCell: (unitMatrixId: string, rowId: string, columnId: string, content: string) => void;
  addColumn: (label: string) => void;
  updateColumn: (id: string, label: string) => void;
  deleteColumn: (id: string) => void;
}

const UnitMatrixContext = createContext<UnitMatrixContextType>({} as UnitMatrixContextType);

export const useUnitMatrix = () => useContext(UnitMatrixContext);

export const UnitMatrixProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unitMatrices, setUnitMatrices] = useState<UnitMatrix[]>(mockUnitMatrices);
  const [columns, setColumns] = useState<UnitMatrixColumn[]>(mockColumns);
  const { getRoomById } = useRooms();
  const { addNotification } = useNotifications();

  const addUnitMatrix = (matrix: Omit<UnitMatrix, 'id' | 'createdAt' | 'updatedAt' | 'roomName'>) => {
    const now = new Date().toISOString();
    const room = getRoomById(matrix.roomId || '');
    
    const newUnitMatrix: UnitMatrix = {
      ...matrix,
      id: Date.now().toString(),
      roomName: room ? room.name : 'Unknown Room',
      createdAt: now,
      updatedAt: now
    };
    
    setUnitMatrices(prev => [...prev, newUnitMatrix]);
    
    addNotification({
      title: 'New Unit Matrix Created',
      message: `Unit matrix "${newUnitMatrix.name}" has been created`,
      type: 'success',
      for: ['1', '2'], // Admin, Manager IDs
    });
  };

  const updateUnitMatrix = (id: string, updates: Partial<UnitMatrix>) => {
    setUnitMatrices(prev => 
      prev.map(matrix => 
        matrix.id === id 
          ? { 
              ...matrix, 
              ...updates,
              roomName: updates.roomId ? (getRoomById(updates.roomId)?.name || 'Unknown Room') : matrix.roomName,
              updatedAt: new Date().toISOString() 
            } 
          : matrix
      )
    );
  };

  const deleteUnitMatrix = (id: string) => {
    const matrixToDelete = unitMatrices.find(matrix => matrix.id === id);
    
    if (matrixToDelete) {
      setUnitMatrices(prev => prev.filter(matrix => matrix.id !== id));
      
      addNotification({
        title: 'Unit Matrix Deleted',
        message: `Unit matrix "${matrixToDelete.name}" has been deleted`,
        type: 'info',
        for: ['1', '2'], // Admin, Manager IDs
      });
    }
  };

  const addRow = (unitMatrixId: string, label: string, color: string) => {
    setUnitMatrices(prev => 
      prev.map(matrix => {
        if (matrix.id !== unitMatrixId) return matrix;
        
        const rowId = `row-${Date.now()}`;
        const newCells: UnitMatrixCell[] = columns.map(column => ({
          id: `${rowId}-${column.id}`,
          rowId,
          columnId: column.id,
          content: ''
        }));
        
        const newRow: UnitMatrixRow = {
          id: rowId,
          label,
          color,
          cells: newCells
        };
        
        return {
          ...matrix,
          rows: [...(matrix.rows || []), newRow],
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const updateRow = (unitMatrixId: string, rowId: string, updates: Partial<UnitMatrixRow>) => {
    setUnitMatrices(prev => 
      prev.map(matrix => {
        if (matrix.id !== unitMatrixId) return matrix;
        
        return {
          ...matrix,
          rows: (matrix.rows || []).map(row => 
            row.id === rowId 
              ? { ...row, ...updates } 
              : row
          ),
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const deleteRow = (unitMatrixId: string, rowId: string) => {
    setUnitMatrices(prev => 
      prev.map(matrix => {
        if (matrix.id !== unitMatrixId) return matrix;
        
        return {
          ...matrix,
          rows: (matrix.rows || []).filter(row => row.id !== rowId),
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const updateCell = (unitMatrixId: string, rowId: string, columnId: string, content: string) => {
    setUnitMatrices(prev => 
      prev.map(matrix => {
        if (matrix.id !== unitMatrixId) return matrix;
        
        return {
          ...matrix,
          rows: (matrix.rows || []).map(row => {
            if (row.id !== rowId) return row;
            
            return {
              ...row,
              cells: row.cells.map(cell => 
                cell.columnId === columnId 
                  ? { ...cell, content } 
                  : cell
              )
            };
          }),
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const addColumn = (label: string) => {
    const newColumnId = `col-${Date.now()}`;
    
    setColumns(prev => [...prev, { id: newColumnId, label }]);
    
    // Add a cell for this column to each row of each matrix
    setUnitMatrices(prev => 
      prev.map(matrix => ({
        ...matrix,
        rows: (matrix.rows || []).map(row => ({
          ...row,
          cells: [
            ...row.cells,
            {
              id: `${row.id}-${newColumnId}`,
              rowId: row.id,
              columnId: newColumnId,
              content: ''
            }
          ]
        })),
        updatedAt: new Date().toISOString()
      }))
    );
  };

  const updateColumn = (id: string, label: string) => {
    setColumns(prev => 
      prev.map(column => 
        column.id === id 
          ? { ...column, label } 
          : column
      )
    );
  };

  const deleteColumn = (id: string) => {
    // First check if there's at least one column left
    if (columns.length <= 1) {
      addNotification({
        title: 'Error',
        message: 'Cannot delete the last column',
        type: 'error',
        for: ['1', '2'], // Admin, Manager IDs
      });
      return;
    }
    
    setColumns(prev => prev.filter(column => column.id !== id));
    
    // Remove this column's cell from each row of each matrix
    setUnitMatrices(prev => 
      prev.map(matrix => ({
        ...matrix,
        rows: (matrix.rows || []).map(row => ({
          ...row,
          cells: row.cells.filter(cell => cell.columnId !== id)
        })),
        updatedAt: new Date().toISOString()
      }))
    );
  };

  return (
    <UnitMatrixContext.Provider value={{ 
      unitMatrices,
      columns,
      addUnitMatrix,
      updateUnitMatrix,
      deleteUnitMatrix,
      addRow,
      updateRow,
      deleteRow,
      updateCell,
      addColumn,
      updateColumn,
      deleteColumn
    }}>
      {children}
    </UnitMatrixContext.Provider>
  );
};
