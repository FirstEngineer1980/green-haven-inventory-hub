
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Search, Package, Filter } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Mock orders data
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

const OrdersPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  
  // Filter orders
  const filteredOrders = mockOrders.filter(order => {
    // Apply search filter
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    // Apply date filter
    let matchesDate = true;
    if (dateFilter === 'last-30-days') {
      const orderDate = new Date(order.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      matchesDate = orderDate >= thirtyDaysAgo;
    } else if (dateFilter === 'last-6-months') {
      const orderDate = new Date(order.date);
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      matchesDate = orderDate >= sixMonthsAgo;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  // Tab-specific filters
  const pendingOrders = filteredOrders.filter(order => ['processing', 'shipped'].includes(order.status));
  const deliveredOrders = filteredOrders.filter(order => order.status === 'delivered');
  const cancelledOrders = filteredOrders.filter(order => order.status === 'cancelled');
  
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
  
  const handleViewOrder = (orderId: string) => {
    navigate(`/orders/${orderId}`);
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Quick overview of your recent orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{mockOrders.length}</div>
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
                  <div className="text-2xl font-bold">{deliveredOrders.length}</div>
                  <p className="text-xs text-muted-foreground">Delivered Orders</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">${mockOrders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Total Spent</p>
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
                placeholder="Search by order ID..."
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
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="last-30-days">Last 30 days</SelectItem>
                  <SelectItem value="last-6-months">Last 6 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
          
          {['all', 'pending', 'delivered', 'cancelled'].map(tab => {
            // Determine which orders to show based on active tab
            let ordersToShow;
            switch (tab) {
              case 'pending':
                ordersToShow = pendingOrders;
                break;
              case 'delivered':
                ordersToShow = deliveredOrders;
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
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No orders found</h2>
                    <p className="text-muted-foreground mb-6">
                      {tab === 'all' 
                        ? 'You have not placed any orders yet.' 
                        : `You don't have any ${tab} orders.`}
                    </p>
                    <Button onClick={() => navigate('/products')}>
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ordersToShow.map(order => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewOrder(order.id)}
                              >
                                View Details
                              </Button>
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

export default OrdersPage;
