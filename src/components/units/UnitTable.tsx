
import React from 'react';
import { format } from 'date-fns';
import { Unit } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash, Info } from 'lucide-react';

interface UnitTableProps {
  units: Unit[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  onEdit: (unit: Unit) => void;
  onView: (unit: Unit) => void;
  onDelete: (id: string) => void;
}

const UnitTable = ({
  units,
  currentPage,
  setCurrentPage,
  totalPages,
  onEdit,
  onView,
  onDelete
}: UnitTableProps) => {
  // Function to determine badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'occupied':
        return <Badge className="bg-blue-500">Occupied</Badge>;
      case 'maintenance':
        return <Badge className="bg-amber-500">Maintenance</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Unit Number</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No units found
                </TableCell>
              </TableRow>
            ) : (
              units.map(unit => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.number}</TableCell>
                  <TableCell>{unit.roomName}</TableCell>
                  <TableCell>{unit.size} {unit.sizeUnit}</TableCell>
                  <TableCell>{getStatusBadge(unit.status)}</TableCell>
                  <TableCell>{format(new Date(unit.updatedAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onView(unit)}>
                        <Info size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEdit(unit)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(unit.id)}>
                        <Trash size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default UnitTable;
