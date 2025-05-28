
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter, FileText, DollarSign, Calendar, User } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { invoiceService } from '@/api/services/invoiceService';
import AddInvoiceDialog from '@/components/invoices/AddInvoiceDialog';
import EditInvoiceDialog from '@/components/invoices/EditInvoiceDialog';
import ViewInvoiceDialog from '@/components/invoices/ViewInvoiceDialog';
import BackendExportButton from '@/components/shared/BackendExportButton';
import BackendImportButton from '@/components/shared/BackendImportButton';
import { format } from 'date-fns';

const InvoicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const { toast } = useToast();

  const { data: invoicesData, isLoading, refetch } = useQuery({
    queryKey: ['invoices', { status: statusFilter, type: typeFilter, search: searchTerm }],
    queryFn: () => invoiceService.getInvoices({ 
      status: statusFilter !== 'all' ? statusFilter : undefined,
      type: typeFilter !== 'all' ? typeFilter : undefined,
      search: searchTerm || undefined
    }),
  });

  const invoices = invoicesData?.data || [];

  const handleEdit = (invoice: any) => {
    setSelectedInvoice(invoice);
    setOpenEditDialog(true);
  };

  const handleView = (invoice: any) => {
    setSelectedInvoice(invoice);
    setOpenViewDialog(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await invoiceService.deleteInvoice(id);
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await invoiceService.updateInvoiceStatus(id, status);
      toast({
        title: "Success",
        description: "Invoice status updated successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary', label: 'Draft' },
      sent: { variant: 'default', label: 'Sent' },
      paid: { variant: 'default', label: 'Paid' },
      overdue: { variant: 'destructive', label: 'Overdue' },
      cancelled: { variant: 'outline', label: 'Cancelled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      salary: { color: 'bg-blue-100 text-blue-800', label: 'Salary' },
      service: { color: 'bg-green-100 text-green-800', label: 'Service' },
      product: { color: 'bg-purple-100 text-purple-800', label: 'Product' },
      commission: { color: 'bg-orange-100 text-orange-800', label: 'Commission' },
      other: { color: 'bg-gray-100 text-gray-800', label: 'Other' },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.other;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>{config.label}</span>;
  };

  const invoiceFields = [
    'id', 'invoice_number', 'type', 'status', 'client_name', 'client_email', 
    'issue_date', 'due_date', 'subtotal', 'tax_rate', 'tax_amount', 
    'discount_amount', 'total_amount', 'notes', 'terms', 'created_at'
  ];

  // Calculate summary stats
  const totalInvoices = invoices.length;
  const totalAmount = invoices.reduce((sum: number, inv: any) => sum + parseFloat(inv.total_amount), 0);
  const paidInvoices = invoices.filter((inv: any) => inv.status === 'paid').length;
  const overdueInvoices = invoices.filter((inv: any) => inv.status === 'overdue').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Invoice Management</h1>
          <div className="flex gap-2">
            <BackendImportButton 
              type="invoices"
              onSuccess={refetch}
            />
            <BackendExportButton 
              type="invoices"
              availableFields={invoiceFields}
            />
            <Button onClick={() => setOpenAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInvoices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{paidInvoices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <Calendar className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{overdueInvoices}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="commission">Commission</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading invoices...</div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No invoices found</p>
                <Button onClick={() => setOpenAddDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Invoice
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice: any) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      <TableCell>{getTypeBadge(invoice.type)}</TableCell>
                      <TableCell>{invoice.client_name}</TableCell>
                      <TableCell>{format(new Date(invoice.issue_date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{format(new Date(invoice.due_date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>${parseFloat(invoice.total_amount).toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleView(invoice)}>
                            View
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(invoice)}>
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => handleDelete(invoice.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AddInvoiceDialog 
        open={openAddDialog} 
        onOpenChange={setOpenAddDialog}
        onSuccess={refetch}
      />
      
      {selectedInvoice && (
        <>
          <EditInvoiceDialog 
            open={openEditDialog} 
            onOpenChange={setOpenEditDialog}
            invoice={selectedInvoice}
            onSuccess={refetch}
          />
          <ViewInvoiceDialog 
            open={openViewDialog} 
            onOpenChange={setOpenViewDialog}
            invoice={selectedInvoice}
            onStatusUpdate={handleStatusUpdate}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default InvoicesPage;
