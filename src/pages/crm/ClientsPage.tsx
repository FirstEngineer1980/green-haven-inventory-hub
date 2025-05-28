
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { crmService } from '@/api/services/crmService';
import AddClientDialog from '@/components/crm/AddClientDialog';
import EditClientDialog from '@/components/crm/EditClientDialog';
import { Client } from '@/types/crm';

const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const { data: clients = [], isLoading, refetch } = useQuery({
    queryKey: ['clients'],
    queryFn: crmService.getClients,
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => {
    refetch();
    setShowAddDialog(false);
  };

  const handleEditClient = () => {
    refetch();
    setEditingClient(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Clients</h1>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search clients..."
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
          <div className="text-center">Loading clients...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{client.name}</CardTitle>
                    <Badge variant={
                      client.status === 'active' ? 'default' :
                      client.status === 'prospect' ? 'secondary' : 'outline'
                    }>
                      {client.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {client.email && (
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    )}
                    {client.phone && (
                      <p className="text-sm text-muted-foreground">{client.phone}</p>
                    )}
                    {client.company && (
                      <p className="text-sm text-muted-foreground">Company: {client.company}</p>
                    )}
                    {client.seller && (
                      <p className="text-sm text-muted-foreground">Seller: {client.seller.name}</p>
                    )}
                    {client.notes && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{client.notes}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => setEditingClient(client)}
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AddClientDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={handleAddClient}
        />

        {editingClient && (
          <EditClientDialog
            client={editingClient}
            open={!!editingClient}
            onOpenChange={() => setEditingClient(null)}
            onSuccess={handleEditClient}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientsPage;
