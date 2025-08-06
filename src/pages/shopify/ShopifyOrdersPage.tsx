import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, ShoppingCart, Filter, Eye, ExternalLink, Loader2 } from 'lucide-react';
import shopifyService from '@/services/shopifyApi';
import { ShopifyOrder } from '@/types/shopify';

const ShopifyOrdersPage = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch orders from backend
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['shopify-orders'],
    queryFn: () => shopifyService.getOrders(),
  });
  
  // Filter orders
  const filteredOrders = orders.filter((order: ShopifyOrder) => {
    const matchesSearch = order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.fulfillment_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Tab-specific filters - fix the pending orders logic
  const pendingOrders = filteredOrders.filter((order: ShopifyOrder) => 
    order.fulfillment_status === 'null' || !order.fulfillment_status
  );
  const fulfilledOrders = filteredOrders.filter((order: ShopifyOrder) => order.fulfillment_status === 'fulfilled');
  const cancelledOrders = filteredOrders.filter((order: ShopifyOrder) => order.cancelled_at);
  
  const getStatusBadge = (order: ShopifyOrder) => {
    if (order.cancelled_at) {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
    }
    
    switch (order.fulfillment_status) {
      case 'null':
      case null:
      case undefined:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'fulfilled':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Fulfilled</Badge>;
      case 'partial':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Partial</Badge>;
      default:
        return <Badge variant="outline">{order.fulfillment_status}</Badge>;
    }
  };
  
  const handleViewOrder = (orderId: string) => {
    navigate(`/shopify/orders/${orderId}`);
  };

  const handleViewCustomer = (customerEmail: string) => {
    navigate(`/shopify/customers?search=${customerEmail}`);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading Shopify orders...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 px-4">
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-2 text-red-600">Error loading orders</h2>
            <p className="text-muted-foreground mb-6">
              Could not connect to Shopify. Please check your configuration.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-8 w-8" />
              Shopify Orders
            </h1>
            <p className="text-muted-foreground mt-2">Manage and view orders from your Shopify store</p>
          </div>
          <Button onClick={() => window.open('https://admin.shopify.com', '_blank')}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Shopify Admin
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Overview of all Shopify orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{orders.length}</div>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{pendingOrders.length}</div>
                  <p className="text-xs text-muted-foreground">Pending Orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{fulfilledOrders.length}</div>
                  <p className="text-xs text-muted-foreground">Fulfilled Orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    ${orders.reduce((sum: number, order: ShopifyOrder) => sum + parseFloat(order.total_price || '0'), 0).toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by order number, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="null">Pending</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          {['all', 'pending', 'fulfilled', 'cancelled'].map(tab => {
            let ordersToShow;
            switch (tab) {
              case 'pending':
                ordersToShow = pendingOrders;
                break;
              case 'fulfilled':
                ordersToShow = fulfilledOrders;
                break;
              case 'cancelled':
                ordersToShow = cancelledOrders;
                break;
              default:
                ordersToShow = filteredOrders;
            }
            
            return (
              <TabsContent key={tab} value={tab}>
                {ordersToShow.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No orders found</h2>
                    <p className="text-muted-foreground mb-6">
                      {tab === 'all' 
                        ? 'No Shopify orders have been synced yet.' 
                        : `No ${tab} orders found.`}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order Number</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ordersToShow.map((order: ShopifyOrder) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.name}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {order.customer?.first_name} {order.customer?.last_name}
                                </div>
                                <div className="text-sm text-muted-foreground">{order.customer?.email}</div>
                              </div>
                            </TableCell>
                            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{getStatusBadge(order)}</TableCell>
                            <TableCell>{order.currency} ${parseFloat(order.total_price).toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewOrder(order.id)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleViewCustomer(order.customer?.email || '')}
                                >
                                  Customer
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ShopifyOrdersPage;
