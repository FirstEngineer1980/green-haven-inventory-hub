
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { invoiceService } from '@/api/services/invoiceService';
import InvoiceTypeForm from './InvoiceTypeForm';

interface AddInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddInvoiceDialog = ({ open, onOpenChange, onSuccess }: AddInvoiceDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    type: '',
    client_name: '',
    client_email: '',
    client_address: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    tax_rate: 0,
    discount_amount: 0,
    notes: '',
    terms: '',
  });
  
  const [typeSpecificData, setTypeSpecificData] = useState({});
  const [items, setItems] = useState([{ description: '', quantity: 1, unit_price: 0, notes: '' }]);

  const handleSubmit = async () => {
    if (!formData.type || !formData.client_name || !formData.due_date || items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and add at least one item",
        variant: "destructive"
      });
      return;
    }

    // Validate items
    const invalidItems = items.some(item => !item.description || item.quantity <= 0 || item.unit_price < 0);
    if (invalidItems) {
      toast({
        title: "Validation Error",
        description: "Please ensure all items have valid description, quantity, and price",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const invoiceData = {
        ...formData,
        ...typeSpecificData,
        items: items.filter(item => item.description.trim() !== '')
      };

      await invoiceService.createInvoice(invoiceData);
      
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
      
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        type: '',
        client_name: '',
        client_email: '',
        client_address: '',
        issue_date: new Date().toISOString().split('T')[0],
        due_date: '',
        tax_rate: 0,
        discount_amount: 0,
        notes: '',
        terms: '',
      });
      setTypeSpecificData({});
      setItems([{ description: '', quantity: 1, unit_price: 0, notes: '' }]);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Invoice Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Invoice Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select invoice type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salary">Salary Invoice</SelectItem>
                  <SelectItem value="service">Service Invoice</SelectItem>
                  <SelectItem value="product">Product Invoice</SelectItem>
                  <SelectItem value="commission">Commission Invoice</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name *</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => handleInputChange('client_name', e.target.value)}
                placeholder="Enter client name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client_email">Client Email</Label>
              <Input
                id="client_email"
                type="email"
                value={formData.client_email}
                onChange={(e) => handleInputChange('client_email', e.target.value)}
                placeholder="Enter client email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issue_date">Issue Date *</Label>
              <Input
                id="issue_date"
                type="date"
                value={formData.issue_date}
                onChange={(e) => handleInputChange('issue_date', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date *</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tax_rate">Tax Rate (%)</Label>
              <Input
                id="tax_rate"
                type="number"
                step="0.01"
                value={formData.tax_rate}
                onChange={(e) => handleInputChange('tax_rate', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client_address">Client Address</Label>
            <Textarea
              id="client_address"
              value={formData.client_address}
              onChange={(e) => handleInputChange('client_address', e.target.value)}
              placeholder="Enter client address"
            />
          </div>

          {/* Type-specific form */}
          {formData.type && (
            <InvoiceTypeForm
              type={formData.type}
              formData={typeSpecificData}
              onChange={setTypeSpecificData}
              items={items}
              onItemsChange={setItems}
            />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount_amount">Discount Amount</Label>
              <Input
                id="discount_amount"
                type="number"
                step="0.01"
                value={formData.discount_amount}
                onChange={(e) => handleInputChange('discount_amount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              value={formData.terms}
              onChange={(e) => handleInputChange('terms', e.target.value)}
              placeholder="Payment terms and conditions"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Invoice'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvoiceDialog;
