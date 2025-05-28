
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, Mail, MapPin, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ViewInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any;
  onStatusUpdate: (id: number, status: string) => void;
}

const ViewInvoiceDialog: React.FC<ViewInvoiceDialogProps> = ({ 
  open, 
  onOpenChange, 
  invoice,
  onStatusUpdate 
}) => {
  if (!invoice) return null;

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

  const handleStatusChange = (newStatus: string) => {
    onStatusUpdate(invoice.id, newStatus);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl">Invoice #{invoice.invoice_number}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                {getTypeBadge(invoice.type)}
                {getStatusBadge(invoice.status)}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Created by</p>
              <p className="font-medium">{invoice.creator?.name}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Client & Invoice Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{invoice.client_name}</span>
                </div>
                {invoice.client_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{invoice.client_email}</span>
                  </div>
                )}
                {invoice.client_address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm">{invoice.client_address}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Invoice Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issue Date:</span>
                  <span>{format(new Date(invoice.issue_date), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date:</span>
                  <span>{format(new Date(invoice.due_date), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <div>
                    <Select value={invoice.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 font-medium text-sm text-muted-foreground border-b pb-2">
                  <span>Description</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-center">Unit Price</span>
                  <span className="text-right">Total</span>
                </div>
                {invoice.items.map((item: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="grid grid-cols-4 gap-4 items-center">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        {item.notes && (
                          <p className="text-sm text-muted-foreground">{item.notes}</p>
                        )}
                      </div>
                      <span className="text-center">{item.quantity}</span>
                      <span className="text-center">${parseFloat(item.unit_price).toFixed(2)}</span>
                      <span className="text-right font-medium">${parseFloat(item.total_price).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Totals */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${parseFloat(invoice.subtotal).toFixed(2)}</span>
                </div>
                {invoice.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${parseFloat(invoice.discount_amount).toFixed(2)}</span>
                  </div>
                )}
                {invoice.tax_rate > 0 && (
                  <div className="flex justify-between">
                    <span>Tax ({invoice.tax_rate}%):</span>
                    <span>${parseFloat(invoice.tax_amount).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>${parseFloat(invoice.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes and Terms */}
          {(invoice.notes || invoice.terms) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {invoice.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{invoice.notes}</p>
                  </CardContent>
                </Card>
              )}
              
              {invoice.terms && (
                <Card>
                  <CardHeader>
                    <CardTitle>Terms & Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{invoice.terms}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handlePrint}>
            <FileText className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewInvoiceDialog;
