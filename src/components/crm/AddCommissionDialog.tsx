
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { crmService } from '@/api/services/crmService';
import { useToast } from '@/hooks/use-toast';

interface CommissionTier {
  min_amount: number;
  max_amount: number | null;
  commission_rate: number;
}

interface AddCommissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sellers: any[];
  clients: any[];
  onSuccess: () => void;
}

const AddCommissionDialog = ({ open, onOpenChange, sellers, clients, onSuccess }: AddCommissionDialogProps) => {
  const [sellerId, setSellerId] = useState('');
  const [clientId, setClientId] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [commissionTiers, setCommissionTiers] = useState<CommissionTier[]>([
    { min_amount: 0, max_amount: 1000, commission_rate: 3 }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addTier = () => {
    const lastTier = commissionTiers[commissionTiers.length - 1];
    const newMinAmount = lastTier.max_amount ? lastTier.max_amount + 1 : 1001;
    setCommissionTiers([
      ...commissionTiers,
      { min_amount: newMinAmount, max_amount: null, commission_rate: 5 }
    ]);
  };

  const removeTier = (index: number) => {
    if (commissionTiers.length > 1) {
      setCommissionTiers(commissionTiers.filter((_, i) => i !== index));
    }
  };

  const updateTier = (index: number, field: keyof CommissionTier, value: number | null) => {
    const updatedTiers = [...commissionTiers];
    updatedTiers[index] = { ...updatedTiers[index], [field]: value };
    setCommissionTiers(updatedTiers);
  };

  const handleSubmit = async () => {
    if (!sellerId || !clientId) {
      toast({
        title: "Validation Error",
        description: "Please select both seller and client",
        variant: "destructive",
      });
      return;
    }

    // Validate commission tiers
    for (let i = 0; i < commissionTiers.length; i++) {
      const tier = commissionTiers[i];
      if (tier.commission_rate <= 0 || tier.commission_rate > 100) {
        toast({
          title: "Validation Error",
          description: "Commission rate must be between 0 and 100",
          variant: "destructive",
        });
        return;
      }
      if (tier.min_amount < 0) {
        toast({
          title: "Validation Error",
          description: "Minimum amount cannot be negative",
          variant: "destructive",
        });
        return;
      }
      if (tier.max_amount && tier.max_amount <= tier.min_amount) {
        toast({
          title: "Validation Error",
          description: "Maximum amount must be greater than minimum amount",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      await crmService.createSellerCommission({
        seller_id: sellerId,
        client_id: clientId,
        commission_tiers: commissionTiers,
        is_active: isActive
      });
      onSuccess();
      // Reset form
      setSellerId('');
      setClientId('');
      setIsActive(true);
      setCommissionTiers([{ min_amount: 0, max_amount: 1000, commission_rate: 3 }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create commission structure",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Commission Structure</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Seller</Label>
              <Select value={sellerId} onValueChange={setSellerId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select seller" />
                </SelectTrigger>
                <SelectContent>
                  {sellers.map(seller => (
                    <SelectItem key={seller.id} value={seller.id}>
                      {seller.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="is-active">Active</Label>
          </div>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Commission Tiers</CardTitle>
                <Button onClick={addTier} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissionTiers.map((tier, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center p-4 border rounded">
                    <div className="col-span-3">
                      <Label className="text-xs">Min Amount ($)</Label>
                      <Input
                        type="number"
                        value={tier.min_amount}
                        onChange={(e) => updateTier(index, 'min_amount', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                    <div className="col-span-3">
                      <Label className="text-xs">Max Amount ($)</Label>
                      <Input
                        type="number"
                        value={tier.max_amount || ''}
                        onChange={(e) => updateTier(index, 'max_amount', e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="∞"
                      />
                    </div>
                    <div className="col-span-3">
                      <Label className="text-xs">Commission Rate (%)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={tier.commission_rate}
                        onChange={(e) => updateTier(index, 'commission_rate', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                    <div className="col-span-3 flex justify-end">
                      {commissionTiers.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTier(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Commission Structure'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCommissionDialog;
