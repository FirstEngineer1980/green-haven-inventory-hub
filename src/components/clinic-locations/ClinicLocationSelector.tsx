import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClinicLocations } from '@/context/ClinicLocationContext';
import { ClinicLocation } from '@/types';

interface ClinicLocationSelectorProps {
  value?: string;
  onValueChange: (locationId: string) => void;
  customerId?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const ClinicLocationSelector: React.FC<ClinicLocationSelectorProps> = ({
  value,
  onValueChange,
  customerId,
  placeholder = "Select location...",
  disabled = false,
  className
}) => {
  const { locations } = useClinicLocations();

  // Filter locations by customer if customerId is provided
  const filteredLocations = customerId 
    ? locations.filter(location => location.customerId === customerId)
    : locations;

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {filteredLocations.map((location) => (
          <SelectItem key={location.id} value={location.id}>
            {location.name}
            {location.address && (
              <span className="text-xs text-muted-foreground ml-2">
                {location.address}
              </span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ClinicLocationSelector;