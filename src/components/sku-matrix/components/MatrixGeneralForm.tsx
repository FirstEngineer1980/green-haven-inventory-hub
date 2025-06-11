
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
  // Filter rooms to ensure they have valid IDs
  const validRooms = rooms.filter(room => room.id && room.id.trim() !== '');
  
  // Use a placeholder value for empty roomId to avoid empty string in Select
  const selectValue = roomId && roomId.trim() !== '' ? roomId : 'no-room-selected';

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
          value={selectValue}
          onValueChange={(value) => onSelectChange('roomId', value)}
        >
          <SelectTrigger id="roomId">
            <SelectValue placeholder="Select a room" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-room-selected">Select a room</SelectItem>
            {validRooms.map((room) => (
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
