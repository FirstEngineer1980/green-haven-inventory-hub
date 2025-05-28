
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { crmService } from '@/api/services/crmService';
import AddSellerDialog from '@/components/crm/AddSellerDialog';
import EditSellerDialog from '@/components/crm/EditSellerDialog';
import { Seller } from '@/types/crm';

const SellersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSeller, setEditingSeller] = useState<Seller | null>(null);

  const { data: sellers = [], isLoading, refetch } = useQuery({
    queryKey: ['sellers'],
    queryFn: crmService.getSellers,
  });

  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    seller.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSeller = () => {
    refetch();
    setShowAddDialog(false);
  };

  const handleEditSeller = () => {
    refetch();
    setEditingSeller(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Sellers</h1>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Seller
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search sellers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center">Loading sellers...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSellers.map((seller) => (
              <Card key={seller.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{seller.name}</CardTitle>
                    <Badge variant={seller.status === 'active' ? 'default' : 'secondary'}>
                      {seller.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{seller.email}</p>
                    {seller.phone && (
                      <p className="text-sm text-muted-foreground">{seller.phone}</p>
                    )}
                    {seller.department && (
                      <p className="text-sm text-muted-foreground">Department: {seller.department}</p>
                    )}
                    {seller.leader && (
                      <p className="text-sm text-muted-foreground">Leader: {seller.leader.name}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Commission: {seller.commission_rate}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Clients: {seller.clients?.length || 0}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => setEditingSeller(seller)}
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AddSellerDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={handleAddSeller}
        />

        {editingSeller && (
          <EditSellerDialog
            seller={editingSeller}
            open={!!editingSeller}
            onOpenChange={() => setEditingSeller(null)}
            onSuccess={handleEditSeller}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default SellersPage;
