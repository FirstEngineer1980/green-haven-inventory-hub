import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useClinicLocations } from '@/context/ClinicLocationContext';
import { useCustomers } from '@/context/CustomerContext';
import { useToast } from '@/hooks/use-toast';
import { ClinicLocation } from '@/types';

interface AddClinicLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId?: string; // Pre-select customer if provided
}

type LocationFormData = Omit<ClinicLocation, 'id' | 'createdAt' | 'updatedAt'>;

const AddClinicLocationDialog: React.FC<AddClinicLocationDialogProps> = ({
  open,
  onOpenChange,
  customerId
}) => {
  const { addLocation } = useClinicLocations();
  const { customers } = useCustomers();
  const { toast } = useToast();
  
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<LocationFormData>({
    defaultValues: {
      customerId: customerId || '',
      status: 'active',
      timezone: 'UTC'
    }
  });

  const selectedCustomerId = watch('customerId');

  React.useEffect(() => {
    if (customerId) {
      setValue('customerId', customerId);
    }
  }, [customerId, setValue]);

  const onSubmit = async (data: LocationFormData) => {
    try {
      await addLocation(data);
      toast({
        title: "Location added",
        description: `${data.name} has been added successfully`,
        variant: "default",
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add clinic location",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Clinic Location</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerId">Customer *</Label>
            <Select 
              value={selectedCustomerId} 
              onValueChange={(value) => setValue('customerId', value)}
              disabled={!!customerId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer..." />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customerId && (
              <p className="text-sm text-destructive">{errors.customerId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Location Name *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Location name is required' })}
              placeholder="e.g., Main Branch, Downtown Office"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="Full address of the location"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="Phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Email address"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person</Label>
            <Input
              id="contactPerson"
              {...register('contactPerson')}
              placeholder="Primary contact person"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select 
                value={watch('timezone')} 
                onValueChange={(value) => setValue('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Asia/Dubai">Dubai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={watch('status')} 
                onValueChange={(value) => setValue('status', value as 'active' | 'inactive')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Additional notes about this location"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Location'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClinicLocationDialog;