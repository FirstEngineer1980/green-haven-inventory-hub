
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, Truck, Clock, CheckCircle, AlertCircle } from 'lucide-react';

// Mock order data is the same as in OrdersPage
const mockOrders = [
  {
    id: 'ORD-123456',
    date: '2024-06-15T14:30:00Z',
    total: 359.97,
    status: 'delivered',
    items: [
      { id: '1', name: 'Laptop', quantity: 1, price: 1200 },
      { id: '5', name: 'Keyboard', quantity: 1, price: 75 }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'US'
    },
    paymentMethod: 'credit_card',
    trackingNumber: 'TRK-987654321'
  },
  {
    id: 'ORD-123457',
    date: '2024-06-10T11:20:00Z',
    total: 250,
    status: 'shipped',
    items: [
      { id: '2', name: 'Office Chair', quantity: 1, price: 250 }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'US'
    },
    paymentMethod: 'paypal',
    trackingNumber: 'TRK-987654322'
  },
  {
    id: 'ORD-123458',
    date: '2024-06-05T09:45:00Z',
    total: 15,
    status: 'processing',
    items: [
      { id: '3', name: 'Notebook', quantity: 3, price: 5 }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'US'
    },
    paymentMethod: 'credit_card',
    trackingNumber: null
  },
  {
    id: 'ORD-123459',
    date: '2024-06-01T15:10:00Z',
    total: 300,
    status: 'cancelled',
    items: [
      { id: '7', name: 'Desk', quantity: 1, price: 300 }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'US'
    },
    paymentMethod: 'credit_card',
    trackingNumber: null
  },
  {
    id: 'ORD-123460',
    date: '2024-05-25T10:30:00Z',
    total: 425,
    status: 'delivered',
    items: [
      { id: '2', name: 'Office Chair', quantity: 1, price: 250 },
      { id: '6', name: 'Pencils', quantity: 5, price: 3 },
      { id: '9', name: 'Monitor', quantity: 1, price: 350 }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'US'
    },
    paymentMethod: 'credit_card',
    trackingNumber: 'TRK-987654323'
  }
];

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any | null>(null);
  
  useEffect(() => {
    // Find the order with the matching ID
    const foundOrder = mockOrders.find(o => o.id === id);
    
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      // Order not found, redirect to orders page
      navigate('/orders');
    }
  }, [id, navigate]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-8 w-8 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-8 w-8 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'cancelled':
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Package className="h-8 w-8" />;
    }
  };
  
  if (!order) {
    return <div>Loading...</div>;
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/orders')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-muted-foreground">Order ID: {order.id}</p>
          </div>
          <div className="mt-4 md:mt-0">
            {getStatusBadge(order.status)}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Order Status</CardTitle>
                  <CardDescription>Current status of your order</CardDescription>
                </div>
                <div className="p-2 rounded-full bg-muted">
                  {getStatusIcon(order.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="relative">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        ['processing', 'shipped', 'delivered'].includes(order.status) 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-muted border-muted-foreground'
                      }`}>
                        1
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium">Order Placed</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-8 left-[15px] w-[2px] h-12 bg-border"></div>
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        ['shipped', 'delivered'].includes(order.status) 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-muted border-muted-foreground'
                      }`}>
                        2
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium">Order Shipped</h3>
                        {order.status === 'processing' ? (
                          <p className="text-sm text-muted-foreground">Pending</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {new Date(new Date(order.date).getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="absolute top-8 left-[15px] w-[2px] h-12 bg-border"></div>
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                        order.status === 'delivered' 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-muted border-muted-foreground'
                      }`}>
                        3
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium">Order Delivered</h3>
                        {order.status === 'delivered' ? (
                          <p className="text-sm text-muted-foreground">
                            {new Date(new Date(order.date).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Pending</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {order.trackingNumber && (
                  <div className="mt-6 p-4 rounded-md bg-muted">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Tracking Number</h3>
                        <p className="text-sm text-muted-foreground">{order.trackingNumber}</p>
                      </div>
                      <Button variant="outline" size="sm">Track Package</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
                <CardDescription>
                  Items included in your order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded overflow-hidden mr-4">
                          <img 
                            src={`https://picsum.photos/seed/${item.id}/200/200`} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${item.price.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>${(order.total * 0.1).toFixed(2)}</span>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${(order.total + order.total * 0.1).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <address className="not-italic">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </address>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="font-medium">
                    {order.paymentMethod === 'credit_card' ? 'Credit Card' : 'PayPal'}
                  </p>
                  {order.paymentMethod === 'credit_card' && (
                    <p className="text-muted-foreground">
                      ending in ****1234
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex space-x-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/orders')}
              >
                Back to Orders
              </Button>
              <Button className="flex-1">
                Need Help?
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetailsPage;
