
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, DollarSign } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { crmService } from '@/api/services/crmService';
import AddCommissionDialog from '@/components/crm/AddCommissionDialog';
import EditCommissionDialog from '@/components/crm/EditCommissionDialog';
import { useToast } from '@/hooks/use-toast';

const SellerCommissionPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCommission, setEditingCommission] = useState(null);
  const { toast } = useToast();

  const { data: sellers = [], isLoading: loadingSellers } = useQuery({
    queryKey: ['sellers'],
    queryFn: crmService.getSellers,
  });

  const { data: clients = [], isLoading: loadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: crmService.getClients,
  });

  const { data: commissions = [], isLoading: loadingCommissions, refetch } = useQuery({
    queryKey: ['seller-commissions'],
    queryFn: crmService.getSellerCommissions,
  });

  const filteredCommissions = commissions.filter(commission =>
    commission.seller?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commission.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCommission = () => {
    refetch();
    setShowAddDialog(false);
    toast({
      title: "Commission structure added",
      description: "The commission structure has been created successfully",
      variant: "default",
    });
  };

  const handleEditCommission = () => {
    refetch();
    setEditingCommission(null);
    toast({
      title: "Commission structure updated",
      description: "The commission structure has been updated successfully",
      variant: "default",
    });
  };

  const handleDeleteCommission = async (id: string) => {
    try {
      await crmService.deleteSellerCommission(id);
      refetch();
      toast({
        title: "Commission structure deleted",
        description: "The commission structure has been deleted successfully",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete commission structure",
        variant: "destructive",
      });
    }
  };

  const formatCommissionTiers = (tiers: any[]) => {
    return tiers.map((tier, index) => (
      <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded mb-1">
        ${tier.min_amount} - ${tier.max_amount || '∞'}: {tier.commission_rate}%
      </div>
    ));
  };

  if (loadingSellers || loadingClients || loadingCommissions) {
    return (
      <DashboardLayout>
        <div className="text-center">Loading commission data...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Seller Commission Management</h1>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Commission Structure
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by seller or client name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Commission Structures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Seller</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Commission Tiers</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No commission structures found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCommissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell className="font-medium">
                        {commission.seller?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {commission.client?.name || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {formatCommissionTiers(commission.commission_tiers || [])}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={commission.is_active ? 'default' : 'secondary'}>
                          {commission.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingCommission(commission)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteCommission(commission.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <AddCommissionDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          sellers={sellers}
          clients={clients}
          onSuccess={handleAddCommission}
        />

        {editingCommission && (
          <EditCommissionDialog
            commission={editingCommission}
            open={!!editingCommission}
            onOpenChange={() => setEditingCommission(null)}
            sellers={sellers}
            clients={clients}
            onSuccess={handleEditCommission}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default SellerCommissionPage;
