
import React from 'react';
import { format } from 'date-fns';
import { Unit } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import UnitLinesManager from './UnitLinesManager';

interface UnitDetailsProps {
  unit: Unit | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (unit: Unit) => void;
  onDelete: (id: string) => void;
}

const UnitDetails = ({ unit, isOpen, onClose, onEdit, onDelete }: UnitDetailsProps) => {
  if (!unit) return null;
  
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Unit Details</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{unit.name}</h3>
            <p>Unit {unit.number}</p>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-muted-foreground">{unit.size} {unit.sizeUnit}</p>
              {unit.status && getStatusBadge(unit.status)}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Room</h4>
              <p>{unit.roomName}</p>
            </div>
            
            {unit.description && (
              <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm">{unit.description}</p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium">Created</h4>
              <p>{format(new Date(unit.createdAt), 'MMMM d, yyyy')}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Last Updated</h4>
              <p>{format(new Date(unit.updatedAt), 'MMMM d, yyyy')}</p>
            </div>
          </div>

          {/* Unit Lines Section */}
          <div className="mt-6">
            <UnitLinesManager unitId={unit.id} unitName={unit.name} />
          </div>
          
          <div className="space-x-2 pt-4">
            <Button variant="outline" onClick={() => onEdit(unit)}>
              Edit Unit
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onDelete(unit.id);
                onClose();
              }}
            >
              Delete Unit
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UnitDetails;
