
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Room {
  id: string;
  name: string;
}

interface MatrixGeneralFormProps {
  name: string;
  roomId: string;
  rooms: Room[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const MatrixGeneralForm = ({ 
  name, 
  roomId, 
  rooms, 
  onInputChange, 
  onSelectChange 
}: MatrixGeneralFormProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Matrix Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter matrix name"
          value={name}
          onChange={onInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="roomId">Room</Label>
        <Select
          value={roomId}
          onValueChange={(value) => onSelectChange('roomId', value)}
        >
          <SelectTrigger id="roomId">
            <SelectValue placeholder="Select a room" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default MatrixGeneralForm;
