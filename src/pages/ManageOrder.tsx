
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useCustomers } from '@/context/CustomerContext';
import { orderService, Order, OrderItem } from '@/api/services/orderService';

// Define form-specific types to avoid TypeScript errors
interface OrderItemForm {
  id?: string;
  product_name: string;
  product_sku?: string;
  quantity: number;
  unit_price: number;
  notes?: string;
}

const ManageOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { customers } = useCustomers();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    customer_id: '',
    status: 'draft' as Order['status'],
    order_date: new Date().toISOString().split('T')[0],
    delivery_date: '',
    notes: ''
  });
  
  const [orderItems, setOrderItems] = useState<OrderItemForm[]>([
    { product_name: '', product_sku: '', quantity: 1, unit_price: 0, notes: '' }
  ]);
  
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);
  
  const fetchOrder = async (id: string) => {
    try {
      const order = await orderService.getOrder(id);
      setFormData({
        customer_id: order.customer_id,
        status: order.status,
        order_date: order.order_date.split('T')[0],
        delivery_date: order.delivery_date ? order.delivery_date.split('T')[0] : '',
        notes: order.notes || ''
      });
      setOrderItems(order.items || []);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast({
        title: "Error",
        description: "Failed to load order details.",
        variant: "destructive"
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setOrderItems(updatedItems);
  };
  
  const addItem = () => {
    setOrderItems([...orderItems, { product_name: '', product_sku: '', quantity: 1, unit_price: 0, notes: '' }]);
  };
  
  const removeItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customer_id || !formData.order_date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const validItems = orderItems.filter(item => 
      item.product_name.trim() !== '' && 
      item.quantity > 0 && 
      item.unit_price >= 0
    );
    
    if (validItems.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one valid order item.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Convert form items to the correct format for the API
      const orderItemsForAPI = validItems.map(item => ({
        product_name: item.product_name,
        product_sku: item.product_sku || '',
        quantity: item.quantity,
        unit_price: item.unit_price,
        notes: item.notes || ''
      }));

      const orderData = {
        customer_id: formData.customer_id,
        status: formData.status,
        order_date: formData.order_date,
        delivery_date: formData.delivery_date || undefined,
        notes: formData.notes || '',
        items: orderItemsForAPI
      };
      
      if (orderId) {
        await orderService.updateOrder(orderId, orderData);
        toast({
          title: "Success",
          description: "Order updated successfully.",
          variant: "default"
        });
      } else {
        await orderService.createOrder(orderData);
        toast({
          title: "Success",
          description: "New order created successfully.",
          variant: "default"
        });
      }
      
      navigate('/orders');
    } catch (error) {
      console.error('Error saving order:', error);
      toast({
        title: "Error",
        description: "Failed to save order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/orders')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {orderId ? 'Edit Order' : 'Create New Order'}
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customer_id">Customer <span className="text-red-500">*</span></Label>
                  <Select value={formData.customer_id} onValueChange={(value) => handleSelectChange('customer_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="order_date">Order Date <span className="text-red-500">*</span></Label>
                  <Input 
                    id="order_date" 
                    name="order_date" 
                    type="date" 
                    value={formData.order_date} 
                    onChange={handleInputChange} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="delivery_date">Delivery Date</Label>
                  <Input 
                    id="delivery_date" 
                    name="delivery_date" 
                    type="date" 
                    value={formData.delivery_date} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    name="notes" 
                    placeholder="Order notes (optional)" 
                    value={formData.notes} 
                    onChange={handleInputChange} 
                    className="min-h-20" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Order Items</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderItems.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                    <div className="md:col-span-2">
                      <Label htmlFor={`product_name_${index}`}>Product Name</Label>
                      <Input
                        id={`product_name_${index}`}
                        placeholder="Product name"
                        value={item.product_name || ''}
                        onChange={(e) => handleItemChange(index, 'product_name', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`product_sku_${index}`}>SKU</Label>
                      <Input
                        id={`product_sku_${index}`}
                        placeholder="SKU (optional)"
                        value={item.product_sku || ''}
                        onChange={(e) => handleItemChange(index, 'product_sku', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`quantity_${index}`}>Quantity</Label>
                      <Input
                        id={`quantity_${index}`}
                        type="number"
                        min="1"
                        value={item.quantity || 1}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor={`unit_price_${index}`}>Unit Price</Label>
                      <Input
                        id={`unit_price_${index}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.unit_price || 0}
                        onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div className="flex items-end">
                      {orderItems.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeItem(index)}
                          className="text-destructive hover:text-destructive"
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
          
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/orders')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Saving...' : (orderId ? 'Update Order' : 'Create Order')}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default ManageOrder;
