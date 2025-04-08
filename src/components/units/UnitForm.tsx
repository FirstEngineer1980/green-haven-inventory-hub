
import React from 'react';
import { Room } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface UnitFormProps {
  rooms: Room[];
  formData: {
    roomId: string;
    number: string;
    size: number;
    sizeUnit: 'sqft' | 'sqm' | 'm²';
    status: 'available' | 'occupied' | 'maintenance';
    description: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
}

const UnitForm = ({
  rooms,
  formData,
  handleInputChange,
  handleSelectChange
}: UnitFormProps) => {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="roomId">Room</Label>
        <Select value={formData.roomId} onValueChange={(value) => handleSelectChange('roomId', value)}>
          <SelectTrigger id="roomId">
            <SelectValue placeholder="Select a room" />
          </SelectTrigger>
          <SelectContent>
            {rooms.length > 0 ? (
              rooms.map(room => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name} (Unit {room.unit})
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-rooms" disabled>No rooms available</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="number">Unit Number</Label>
        <Input 
          id="number" 
          name="number" 
          value={formData.number} 
          onChange={handleInputChange} 
          placeholder="Unit number (e.g. U101)"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <Input 
            id="size" 
            name="size" 
            type="number" 
            value={formData.size.toString()} 
            onChange={handleInputChange} 
            placeholder="Size"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sizeUnit">Unit</Label>
          <Select 
            value={formData.sizeUnit} 
            onValueChange={(value) => handleSelectChange('sizeUnit', value as 'sqft' | 'sqm' | 'm²')}
          >
            <SelectTrigger id="sizeUnit">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sqft">Square Feet (sqft)</SelectItem>
              <SelectItem value="sqm">Square Meters (sqm)</SelectItem>
              <SelectItem value="m²">Square Meters (m²)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleSelectChange('status', value as 'available' | 'occupied' | 'maintenance')}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={handleInputChange} 
          placeholder="Unit description"
          rows={3}
        />
      </div>
    </div>
  );
};

export default UnitForm;
