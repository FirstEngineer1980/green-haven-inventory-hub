
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { crmService } from '@/api/services/crmService';
import { toast } from 'sonner';
import { Client } from '@/types/crm';

interface EditClientDialogProps {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditClientDialog: React.FC<EditClientDialogProps> = ({ client, open, onOpenChange, onSuccess }) => {
  const { register, handleSubmit, reset, setValue } = useForm<Partial<Client>>();

  const { data: sellers = [] } = useQuery({
    queryKey: ['sellers'],
    queryFn: crmService.getSellers,
    enabled: open,
  });

  useEffect(() => {
    if (client) {
      reset({
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        address: client.address,
        notes: client.notes,
        seller_id: client.seller_id,
        status: client.status,
      });
    }
  }, [client, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Client>) => crmService.updateClient(client.id, data),
    onSuccess: () => {
      toast.success('Client updated successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update client');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => crmService.deleteClient(client.id),
    onSuccess: () => {
      toast.success('Client deleted successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete client');
    },
  });

  const onSubmit = (data: Partial<Client>) => {
    updateMutation.mutate(data);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this client?')) {
      deleteMutation.mutate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name', { required: true })}
              placeholder="Enter client name"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
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
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              {...register('company')}
              placeholder="Enter company name"
            />
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="Enter address"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="seller_id">Seller</Label>
            <Select onValueChange={(value) => setValue('seller_id', value)} defaultValue={client.seller_id}>
              <SelectTrigger>
                <SelectValue placeholder="Select a seller" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No seller</SelectItem>
                {sellers.map((seller) => (
                  <SelectItem key={seller.id} value={seller.id}>
                    {seller.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={(value) => setValue('status', value as 'active' | 'inactive' | 'prospect')} defaultValue={client.status}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Enter notes"
              rows={3}
            />
          </div>

          <div className="flex justify-between">
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
            <div className="space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;
