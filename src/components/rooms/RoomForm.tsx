
import React from 'react';
import { Customer } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RoomFormProps {
  customers: Customer[];
  formData: {
    customerId: string;
    name: string;
    unit: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomerChange: (value: string) => void;
}

const RoomForm = ({
  customers,
  formData,
  handleInputChange,
  handleCustomerChange
}: RoomFormProps) => {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="customerId">Customer</Label>
        <Select value={formData.customerId} onValueChange={handleCustomerChange}>
          <SelectTrigger id="customerId">
            <SelectValue placeholder="Select a customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.length > 0 ? (
              customers.map(customer => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-customers">No customers available</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="name">Room Name</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleInputChange} 
          placeholder="Room name or description"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="unit">Unit Number</Label>
        <Input 
          id="unit" 
          name="unit" 
          type="number" 
          value={formData.unit.toString()} 
          onChange={handleInputChange} 
          placeholder="Unit number"
        />
      </div>
    </div>
  );
};

export default RoomForm;
