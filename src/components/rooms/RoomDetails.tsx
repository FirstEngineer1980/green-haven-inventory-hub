
import React from 'react';
import { format } from 'date-fns';
import { Room } from '@/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface RoomDetailsProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (room: Room) => void;
  onDelete: (id: string) => void;
}

const RoomDetails = ({ room, isOpen, onClose, onEdit, onDelete }: RoomDetailsProps) => {
  if (!room) return null;
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Room Details</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{room.name}</h3>
            <p className="text-sm text-muted-foreground">Unit {room.unit}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Customer</h4>
              <p>{room.customerName}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Created</h4>
              <p>{format(new Date(room.createdAt), 'MMMM d, yyyy')}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Last Updated</h4>
              <p>{format(new Date(room.updatedAt), 'MMMM d, yyyy')}</p>
            </div>
          </div>
          
          <div className="space-x-2 pt-4">
            <Button variant="outline" onClick={() => onEdit(room)}>
              Edit Room
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onDelete(room.id);
                onClose();
              }}
            >
              Delete Room
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RoomDetails;
