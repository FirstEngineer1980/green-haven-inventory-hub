
import React from 'react';
import { Room } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UnitFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedRoom: string;
  selectedStatus: string;
  handleRoomFilterChange: (value: string) => void;
  handleStatusFilterChange: (value: string) => void;
  rooms: Room[];
}

const UnitFilters = ({
  searchTerm,
  setSearchTerm,
  selectedRoom,
  selectedStatus,
  handleRoomFilterChange,
  handleStatusFilterChange,
  rooms
}: UnitFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="flex-1">
        <Input 
          placeholder="Search units..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="w-full sm:w-48">
        <Select value={selectedRoom} onValueChange={handleRoomFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by room" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Rooms</SelectItem>
            {rooms.map(room => (
              <SelectItem key={room.id} value={room.id}>
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full sm:w-48">
        <Select value={selectedStatus} onValueChange={handleStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="occupied">Occupied</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UnitFilters;
