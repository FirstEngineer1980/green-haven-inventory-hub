
import React from 'react';
import { Customer } from '@/types';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RoomFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void; // Update to match what's being passed
  customerFilter: string;
  onCustomerFilterChange: (value: string) => void; // Update to match what's being passed
  customers: Customer[];
}

const RoomFilters = ({
  searchTerm,
  onSearchChange,
  customerFilter,
  onCustomerFilterChange,
  customers
}: RoomFiltersProps) => {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search rooms..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-48">
        <Select value={customerFilter} onValueChange={onCustomerFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Customers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            {customers.map(customer => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RoomFilters;
