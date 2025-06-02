
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { crmService } from '@/api/services/crmService';
import AddCommissionDialog from '@/components/crm/AddCommissionDialog';
import EditCommissionDialog from '@/components/crm/EditCommissionDialog';
import { format } from 'date-fns';

const CommissionDashboard = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { toast } = useToast();

  const { data: commissions, isLoading: commissionsLoading, refetch: refetchCommissions } = useQuery({
    queryKey: ['seller-commissions'],
    queryFn: () => crmService.getSellerCommissions(),
  });

  const { data: sellers, isLoading: sellersLoading } = useQuery({
    queryKey: ['sellers'],
    queryFn: () => crmService.getSellers(),
  });

  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => crmService.getClients(),
  });

  const handleEdit = (commission: any) => {
    setSelectedCommission(commission);
    setOpenEditDialog(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await crmService.deleteSellerCommission(id);
      toast({
        title: "Success",
        description: "Commission structure deleted successfully",
      });
      refetchCommissions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete commission structure",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    try {
      await crmService.updateSellerCommission(id, { is_active: !isActive });
      toast({
        title: "Success",
        description: `Commission structure ${!isActive ? 'activated' : 'deactivated'} successfully`,
      });
      refetchCommissions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update commission structure",
        variant: "destructive",
      });
    }
  };

  // Calculate summary stats
  const totalCommissions = commissions?.length || 0;
  const activeCommissions = commissions?.filter((c: any) => c.is_active).length || 0;
  const totalSellers = sellers?.length || 0;
  const averageCommissionRate = commissions?.length 
    ? commissions.reduce((sum: number, c: any) => {
        const avgRate = c.commission_tiers?.reduce((tierSum: number, tier: any) => tierSum + tier.commission_rate, 0) / (c.commission_tiers?.length || 1);
        return sum + avgRate;
      }, 0) / commissions.length
    : 0;

  const getSeller = (sellerId: number) => {
    return sellers?.find((s: any) => s.id === sellerId);
  };

  const getClient = (clientId: number) => {
    return clients?.find((c: any) => c.id === clientId);
  };

  const formatCommissionTiers = (tiers: any[]) => {
    if (!tiers || tiers.length === 0) return 'No tiers defined';
    
    return tiers.map((tier, index) => (
      <div key={index} className="text-xs">
        {tier.min_amount ? `$${tier.min_amount}` : '$0'} - {tier.max_amount ? `$${tier.max_amount}` : '∞'}: {tier.commission_rate}%
      </div>
    ));
  };

  if (commissionsLoading || sellersLoading || clientsLoading) {
    return (
      <DashboardLayout>
        <div className="text-center py-8">Loading commission data...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Commission Management</h1>
          <Button onClick={() => setOpenAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Commission Structure
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCommissions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Structures</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeCommissions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sellers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSellers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Commission Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageCommissionRate.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Commission Structures Table */}
        <Card>
          <CardHeader>
            <CardTitle>Commission Structures</CardTitle>
          </CardHeader>
          <CardContent>
            {!commissions || commissions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No commission structures found</p>
                <Button onClick={() => setOpenAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Commission Structure
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seller</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Commission Tiers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissions.map((commission: any) => {
                    const seller = getSeller(commission.seller_id);
                    const client = getClient(commission.client_id);
                    
                    return (
                      <TableRow key={commission.id}>
                        <TableCell className="font-medium">
                          {seller ? seller.name : `Seller #${commission.seller_id}`}
                        </TableCell>
                        <TableCell>
                          {client ? client.name : `Client #${commission.client_id}`}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            {formatCommissionTiers(commission.commission_tiers)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={commission.is_active ? 'default' : 'secondary'}>
                            {commission.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(commission.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEdit(commission)}
                            >
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant={commission.is_active ? 'secondary' : 'default'}
                              onClick={() => handleToggleStatus(commission.id, commission.is_active)}
                            >
                              {commission.is_active ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => handleDelete(commission.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AddCommissionDialog 
        open={openAddDialog} 
        onOpenChange={setOpenAddDialog}
        onSuccess={refetchCommissions}
      />
      
      {selectedCommission && (
        <EditCommissionDialog 
          open={openEditDialog} 
          onOpenChange={setOpenEditDialog}
          commission={selectedCommission}
          onSuccess={refetchCommissions}
        />
      )}
    </DashboardLayout>
  );
};

export default CommissionDashboard;
