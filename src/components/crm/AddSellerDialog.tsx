
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { crmService } from '@/api/services/crmService';
import { authService } from '@/api/services/authService';
import { toast } from 'sonner';
import { Seller } from '@/types/crm';

interface AddSellerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddSellerDialog: React.FC<AddSellerDialogProps> = ({ open, onOpenChange, onSuccess }) => {
  const { register, handleSubmit, reset, setValue, watch } = useForm<Omit<Seller, 'id' | 'created_at' | 'updated_at'>>();

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: authService.getUsers,
    enabled: open,
  });

  const createMutation = useMutation({
    mutationFn: crmService.createSeller,
    onSuccess: () => {
      toast.success('Seller created successfully');
      reset();
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create seller');
    },
  });

  const onSubmit = (data: Omit<Seller, 'id' | 'created_at' | 'updated_at'>) => {
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Seller</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name', { required: true })}
              placeholder="Enter seller name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { required: true })}
              placeholder="Enter email address"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              {...register('department')}
              placeholder="Enter department"
            />
          </div>

          <div>
            <Label htmlFor="commission_rate">Commission Rate (%)</Label>
            <Input
              id="commission_rate"
              type="number"
              step="0.01"
              min="0"
              max="100"
              {...register('commission_rate', { valueAsNumber: true })}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="leader_id">Leader</Label>
            <Select onValueChange={(value) => setValue('leader_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a leader" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No leader</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => setValue('status', value as 'active' | 'inactive')} defaultValue="active">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Seller'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSellerDialog;
