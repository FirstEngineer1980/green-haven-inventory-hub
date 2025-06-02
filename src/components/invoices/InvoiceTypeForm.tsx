
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface LocalInvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  notes?: string;
}

interface InvoiceTypeFormProps {
  type: string;
  formData: any;
  onChange: (data: any) => void;
  items: LocalInvoiceItem[];
  onItemsChange: (items: LocalInvoiceItem[]) => void;
}

const InvoiceTypeForm = ({ type, formData, onChange, items, onItemsChange }: InvoiceTypeFormProps) => {
  const handleChange = (field: string, value: any) => {
    onChange({ ...formData, [field]: value });
  };

  const addItem = () => {
    onItemsChange([...items, { description: '', quantity: 1, unit_price: 0, notes: '' }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    onItemsChange(updatedItems);
  };

  const removeItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  const renderTypeSpecificFields = () => {
    switch (type) {
      case 'salary':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_id">Employee ID</Label>
              <Input
                id="employee_id"
                value={formData.employee_id || ''}
                onChange={(e) => handleChange('employee_id', e.target.value)}
                placeholder="Enter employee ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary_period">Salary Period</Label>
              <Select value={formData.salary_period || ''} onValueChange={(value) => handleChange('salary_period', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="base_salary">Base Salary</Label>
              <Input
                id="base_salary"
                type="number"
                step="0.01"
                value={formData.base_salary || ''}
                onChange={(e) => handleChange('base_salary', parseFloat(e.target.value))}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="overtime_hours">Overtime Hours</Label>
              <Input
                id="overtime_hours"
                type="number"
                step="0.1"
                value={formData.overtime_hours || ''}
                onChange={(e) => handleChange('overtime_hours', parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>
        );

      case 'commission':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seller_id">Seller ID</Label>
              <Input
                id="seller_id"
                value={formData.seller_id || ''}
                onChange={(e) => handleChange('seller_id', e.target.value)}
                placeholder="Enter seller ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission_rate">Commission Rate (%)</Label>
              <Input
                id="commission_rate"
                type="number"
                step="0.01"
                value={formData.commission_rate || ''}
                onChange={(e) => handleChange('commission_rate', parseFloat(e.target.value))}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sales_amount">Total Sales Amount</Label>
              <Input
                id="sales_amount"
                type="number"
                step="0.01"
                value={formData.sales_amount || ''}
                onChange={(e) => handleChange('sales_amount', parseFloat(e.target.value))}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission_period">Commission Period</Label>
              <Select value={formData.commission_period || ''} onValueChange={(value) => handleChange('commission_period', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'product':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="po_reference">PO Reference</Label>
              <Input
                id="po_reference"
                value={formData.po_reference || ''}
                onChange={(e) => handleChange('po_reference', e.target.value)}
                placeholder="Enter PO reference number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery_date">Delivery Date</Label>
              <Input
                id="delivery_date"
                type="date"
                value={formData.delivery_date || ''}
                onChange={(e) => handleChange('delivery_date', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_method">Shipping Method</Label>
              <Select value={formData.shipping_method || ''} onValueChange={(value) => handleChange('shipping_method', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Shipping</SelectItem>
                  <SelectItem value="express">Express Shipping</SelectItem>
                  <SelectItem value="overnight">Overnight</SelectItem>
                  <SelectItem value="pickup">Pickup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="warehouse_location">Warehouse Location</Label>
              <Input
                id="warehouse_location"
                value={formData.warehouse_location || ''}
                onChange={(e) => handleChange('warehouse_location', e.target.value)}
                placeholder="Enter warehouse location"
              />
            </div>
          </div>
        );

      case 'service':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service_category">Service Category</Label>
              <Select value={formData.service_category || ''} onValueChange={(value) => handleChange('service_category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="installation">Installation</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="service_period">Service Period</Label>
              <Input
                id="service_period"
                value={formData.service_period || ''}
                onChange={(e) => handleChange('service_period', e.target.value)}
                placeholder="e.g., Jan 2024 - Mar 2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourly_rate">Hourly Rate</Label>
              <Input
                id="hourly_rate"
                type="number"
                step="0.01"
                value={formData.hourly_rate || ''}
                onChange={(e) => handleChange('hourly_rate', parseFloat(e.target.value))}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total_hours">Total Hours</Label>
              <Input
                id="total_hours"
                type="number"
                step="0.1"
                value={formData.total_hours || ''}
                onChange={(e) => handleChange('total_hours', parseFloat(e.target.value))}
                placeholder="0"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="custom_field">Additional Information</Label>
            <Textarea
              id="custom_field"
              value={formData.custom_field || ''}
              onChange={(e) => handleChange('custom_field', e.target.value)}
              placeholder="Enter any additional information for this invoice type"
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Type-specific fields */}
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">{type} Invoice Details</CardTitle>
        </CardHeader>
        <CardContent>
          {renderTypeSpecificFields()}
        </CardContent>
      </Card>

      {/* Invoice Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoice Items</CardTitle>
          <Button onClick={addItem} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(index, 'description', e.target.value)}
                    placeholder="Item description"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total</Label>
                  <Input
                    value={`$${(item.quantity * item.unit_price).toFixed(2)}`}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Actions</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="md:col-span-5 space-y-2">
                  <Label>Notes (Optional)</Label>
                  <Input
                    value={item.notes || ''}
                    onChange={(e) => updateItem(index, 'notes', e.target.value)}
                    placeholder="Additional notes for this item"
                  />
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No items added yet. Click "Add Item" to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceTypeForm;
