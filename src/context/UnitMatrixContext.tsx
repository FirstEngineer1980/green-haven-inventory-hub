import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UnitMatrix, UnitMatrixRow, UnitMatrixCell } from '../types';
import { useRooms } from './RoomContext';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';
import { apiInstance } from '@/api/services/api';

interface UnitMatrixColumn {
  id: string;
  label: string;
}

const defaultColumns: UnitMatrixColumn[] = [
  { id: 'col-1', label: 'Column 1' },
  { id: 'col-2', label: 'Column 2' },
  { id: 'col-3', label: 'Column 3' },
  { id: 'col-4', label: 'Column 4' },
  { id: 'col-5', label: 'Column 5' },
];

interface UnitMatrixContextType {
  unitMatrices: UnitMatrix[];
  columns: UnitMatrixColumn[];
  loading: boolean;
  error: string | null;
  fetchUnitMatrices: () => Promise<void>;
  addUnitMatrix: (matrix: Omit<UnitMatrix, 'id' | 'createdAt' | 'updatedAt' | 'roomName'>) => Promise<void>;
  updateUnitMatrix: (id: string, updates: Partial<UnitMatrix>) => Promise<void>;
  deleteUnitMatrix: (id: string) => Promise<void>;
  addRow: (unitMatrixId: string, label: string, color: string) => Promise<void>;
  updateRow: (unitMatrixId: string, rowId: string, updates: Partial<UnitMatrixRow>) => Promise<void>;
  deleteRow: (unitMatrixId: string, rowId: string) => Promise<void>;
  updateCell: (unitMatrixId: string, rowId: string, columnId: string, content: string) => Promise<void>;
  addColumn: (label: string) => void;
  updateColumn: (id: string, label: string) => void;
  deleteColumn: (id: string) => void;
}

const UnitMatrixContext = createContext<UnitMatrixContextType>({} as UnitMatrixContextType);

export const useUnitMatrix = () => useContext(UnitMatrixContext);

const transformBackendUnitMatrix = (backend: any): UnitMatrix => ({
  id: backend.id?.toString() ?? '',
  name: backend.name ?? '',
  description: backend.description ?? '',
  roomId: backend.room_id?.toString() ?? backend.roomId ?? '',
  roomName: backend.room?.name ?? backend.roomName ?? '',
  rows: Array.isArray(backend.rows)
    ? backend.rows.map((r: any) => ({
        id: r.id?.toString() ?? '',
        name: r.label ?? r.name ?? '',
        label: r.label ?? '',
        color: r.color ?? '#FFFFFF',
        cells: Array.isArray(r.cells)
          ? r.cells.map((c: any) => ({
              id: c.id?.toString() ?? '',
              value: c.value ?? '',
              content: c.value ?? '',
              columnId: c.column_id ?? c.columnId ?? '',
            }))
          : [],
      }))
    : [],
  createdAt: backend.created_at ?? backend.createdAt ?? new Date().toISOString(),
  updatedAt: backend.updated_at ?? backend.updatedAt ?? new Date().toISOString(),
});

const buildUpdatePayload = (matrix: UnitMatrix) => ({
  name: matrix.name,
  description: matrix.description,
  room_id: matrix.roomId,
  rows: (matrix.rows || []).map((row) => ({
    id: isNaN(Number(row.id)) ? undefined : Number(row.id),
    label: row.label || row.name,
    color: row.color,
    cells: (row.cells || []).map((cell) => ({
      id: isNaN(Number(cell.id)) ? undefined : Number(cell.id),
      column_id: cell.columnId || '',
      value: cell.value ?? cell.content ?? '',
    })),
  })),
});

export const UnitMatrixProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unitMatrices, setUnitMatrices] = useState<UnitMatrix[]>([]);
  const [columns, setColumns] = useState<UnitMatrixColumn[]>(defaultColumns);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getRoomById } = useRooms();
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const fetchUnitMatrices = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiInstance.get('/unit-matrices');
      const data = Array.isArray(res.data) ? res.data : [];
      setUnitMatrices(data.map(transformBackendUnitMatrix));
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || 'Failed to fetch unit matrices');
      setUnitMatrices([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Do not auto-fetch; the page will trigger to avoid double loads
  }, []);

  const addUnitMatrix = async (matrix: Omit<UnitMatrix, 'id' | 'createdAt' | 'updatedAt' | 'roomName'>) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // Ensure rows include cells for existing columns
      const rowsWithCells = (matrix.rows || []).map((row) => ({
        label: row.label || row.name,
        color: row.color,
        cells: (columns || []).map((col) => ({ column_id: col.id, value: '' })),
      }));
      const payload = {
        name: matrix.name,
        description: matrix.description || '',
        room_id: matrix.roomId,
        rows: rowsWithCells,
      };
      const res = await apiInstance.post('/unit-matrices', payload);
      const created = transformBackendUnitMatrix(res.data);
      setUnitMatrices((prev) => [...prev, created]);
      addNotification({ title: 'Unit Matrix Added', message: `"${created.name}" created`, type: 'info', for: ['1', '2'] });
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || 'Failed to add unit matrix');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateAndSync = async (updated: UnitMatrix) => {
    const payload = buildUpdatePayload(updated);
    const res = await apiInstance.put(`/unit-matrices/${updated.id}`, payload);
    return transformBackendUnitMatrix(res.data);
  };

  const updateUnitMatrix = async (id: string, updates: Partial<UnitMatrix>) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const existing = unitMatrices.find((m) => m.id === id);
      if (!existing) return;
      const next: UnitMatrix = {
        ...existing,
        ...updates,
        roomName: updates.roomId ? (getRoomById(updates.roomId)?.name || existing.roomName) : existing.roomName,
      };
      const saved = await updateAndSync(next);
      setUnitMatrices((prev) => prev.map((m) => (m.id === id ? saved : m)));
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || 'Failed to update unit matrix');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const deleteUnitMatrix = async (id: string) => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await apiInstance.delete(`/unit-matrices/${id}`);
      setUnitMatrices((prev) => prev.filter((m) => m.id !== id));
      addNotification({ title: 'Unit Matrix Deleted', message: 'Unit matrix removed', type: 'info', for: ['1', '2'] });
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || 'Failed to delete unit matrix');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const addRow = async (unitMatrixId: string, label: string, color: string) => {
    const matrix = unitMatrices.find((m) => m.id === unitMatrixId);
    if (!matrix) return;
    const newRowId = `tmp-${Date.now()}`;
    const newRow: UnitMatrixRow = {
      id: newRowId,
      name: label,
      label,
      color,
      cells: (columns || []).map((col) => ({ id: `${newRowId}-${col.id}`, value: '', content: '', columnId: col.id } as UnitMatrixCell)),
    };
    const optimistic = { ...matrix, rows: [...(matrix.rows || []), newRow] };
    setUnitMatrices((prev) => prev.map((m) => (m.id === unitMatrixId ? optimistic : m)));
    try {
      const saved = await updateAndSync(optimistic);
      setUnitMatrices((prev) => prev.map((m) => (m.id === unitMatrixId ? saved : m)));
    } catch (e) {
      await fetchUnitMatrices();
      throw e;
    }
  };

  const updateRow = async (unitMatrixId: string, rowId: string, updates: Partial<UnitMatrixRow>) => {
    const matrix = unitMatrices.find((m) => m.id === unitMatrixId);
    if (!matrix) return;
    const next: UnitMatrix = {
      ...matrix,
      rows: (matrix.rows || []).map((r) => (r.id === rowId ? { ...r, ...updates } : r)),
    };
    setUnitMatrices((prev) => prev.map((m) => (m.id === unitMatrixId ? next : m)));
    try {
      const saved = await updateAndSync(next);
      setUnitMatrices((prev) => prev.map((m) => (m.id === unitMatrixId ? saved : m)));
    } catch (e) {
      await fetchUnitMatrices();
      throw e;
    }
  };

  const deleteRow = async (unitMatrixId: string, rowId: string) => {
    const matrix = unitMatrices.find((m) => m.id === unitMatrixId);
    if (!matrix) return;
    const next: UnitMatrix = {
      ...matrix,
      rows: (matrix.rows || []).filter((r) => r.id !== rowId),
    };
    setUnitMatrices((prev) => prev.map((m) => (m.id === unitMatrixId ? next : m)));
    try {
      const saved = await updateAndSync(next);
      setUnitMatrices((prev) => prev.map((m) => (m.id === unitMatrixId ? saved : m)));
    } catch (e) {
      await fetchUnitMatrices();
      throw e;
    }
  };

  const updateCell = async (unitMatrixId: string, rowId: string, columnId: string, content: string) => {
    const matrix = unitMatrices.find((m) => m.id === unitMatrixId);
    if (!matrix) return;
    const next: UnitMatrix = {
      ...matrix,
      rows: (matrix.rows || []).map((r) =>
        r.id === rowId
          ? {
              ...r,
              cells: (r.cells || []).map((c) => (c.columnId === columnId ? { ...c, value: content, content } : c)),
            }
          : r,
      ),
    };
    setUnitMatrices((prev) => prev.map((m) => (m.id === unitMatrixId ? next : m)));
    try {
      const saved = await updateAndSync(next);
      setUnitMatrices((prev) => prev.map((m) => (m.id === unitMatrixId ? saved : m)));
    } catch (e) {
      await fetchUnitMatrices();
      throw e;
    }
  };

  const addColumn = (label: string) => {
    const newColumn: UnitMatrixColumn = { id: `col-${Date.now()}`, label };
    setColumns((prev) => [...prev, newColumn]);
    // Note: columns are front-end only; cells will be created on demand when rows are saved
  };

  const updateColumn = (id: string, label: string) => {
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, label } : c)));
  };

  const deleteColumn = (id: string) => {
    setColumns((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <UnitMatrixContext.Provider
      value={{
        unitMatrices,
        columns,
        loading,
        error,
        fetchUnitMatrices,
        addUnitMatrix,
        updateUnitMatrix,
        deleteUnitMatrix,
        addRow,
        updateRow,
        deleteRow,
        updateCell,
        addColumn,
        updateColumn,
        deleteColumn,
      }}
    >
      {children}
    </UnitMatrixContext.Provider>
  );
};
