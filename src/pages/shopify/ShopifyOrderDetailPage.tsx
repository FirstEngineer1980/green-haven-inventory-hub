
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Package, User, MapPin, CreditCard, Loader2 } from 'lucide-react';
import shopifyService from '@/services/shopifyApi';
import { ShopifyOrder } from '@/types/shopify';

const ShopifyOrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  // Fetch order details from backend
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['shopify-order', orderId],
    queryFn: () => shopifyService.getOrder(orderId!),
    enabled: !!orderId,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
      case 'null':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'fulfilled':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Fulfilled</Badge>;
      case 'partial':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Partial</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading order details...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !order) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-2 text-red-600">Order not found</h2>
            <p className="text-muted-foreground mb-6">
              Could not load order details. Please try again.
            </p>
            <Button onClick={() => navigate('/shopify/orders')}>
              Back to Orders
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/shopify/orders')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order {order.name}</h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="ml-auto">
            {getStatusBadge(order.fulfillment_status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </CardTitle>
                <CardDescription>
                  Items in this order
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.line_items?.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.title}</div>
                            {item.variant_title && (
                              <div className="text-sm text-muted-foreground">{item.variant_title}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{item.sku || 'N/A'}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>${parseFloat(item.price).toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-6 border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span>Subtotal</span>
                    <span>${parseFloat(order.subtotal_price).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span>Tax</span>
                    <span>${parseFloat(order.total_tax).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>${parseFloat(order.total_price).toFixed(2)} {order.currency}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Details Sidebar */}
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="font-medium">
                    {order.customer?.first_name} {order.customer?.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground">{order.customer?.email}</div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => navigate(`/shopify/customers?search=${order.customer?.email}`)}
                  >
                    View Customer
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.shipping_address && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">{order.shipping_address.name}</div>
                    <div>{order.shipping_address.address1}</div>
                    {order.shipping_address.address2 && (
                      <div>{order.shipping_address.address2}</div>
                    )}
                    <div>
                      {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.zip}
                    </div>
                    <div>{order.shipping_address.country}</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment & Fulfillment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment & Fulfillment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Payment Status</span>
                    <Badge variant={order.financial_status === 'paid' ? 'default' : 'secondary'}>
                      {order.financial_status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fulfillment</span>
                    <Badge variant={order.fulfillment_status === 'fulfilled' ? 'default' : 'secondary'}>
                      {order.fulfillment_status}
                    </Badge>
                  </div>
                  {order.fulfillments && order.fulfillments.length > 0 && (
                    <div className="pt-2 border-t">
                      <div className="text-sm font-medium mb-1">Tracking Numbers</div>
                      {order.fulfillments.map(fulfillment => 
                        fulfillment.tracking_numbers?.map(tracking => (
                          <div key={tracking} className="text-sm text-muted-foreground font-mono">
                            {tracking}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Notes */}
            {order.note && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{order.note}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ShopifyOrderDetailPage;
