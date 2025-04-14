
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, SquarePlus, Package, ArrowUp, ArrowDown, Wand2 } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import ProductsChart from '@/components/dashboard/ProductsChart';
import StockTrendChart from '@/components/dashboard/StockTrendChart';
import RecentMovements from '@/components/dashboard/RecentMovements';
import LowStockAlert from '@/components/dashboard/LowStockAlert';
import { Product, StockMovement } from '@/types';

const Dashboard = () => {
  const navigate = useNavigate();
  const [productCategories] = useState([
    { category: 'Electronics', count: 24 },
    { category: 'Furniture', count: 18 },
    { category: 'Office Supplies', count: 12 },
    { category: 'Kitchen', count: 9 },
    { category: 'Bathroom', count: 6 }
  ]);

  // Updated stockTrends to match the expected format for StockTrendChart
  const [stockTrends] = useState([
    { date: '2023-01-15T00:00:00Z', inStock: 65 },
    { date: '2023-02-15T00:00:00Z', inStock: 78 },
    { date: '2023-03-15T00:00:00Z', inStock: 82 },
    { date: '2023-04-15T00:00:00Z', inStock: 70 },
    { date: '2023-05-15T00:00:00Z', inStock: 85 },
    { date: '2023-06-15T00:00:00Z', inStock: 90 },
  ]);

  // Define lowStockProducts with correct Product type
  const [lowStockProducts] = useState<Product[]>([
    { 
      id: '1', 
      name: 'MacBook Pro', 
      quantity: 2, 
      threshold: 5,
      sku: 'MBP-2023',
      description: 'Apple MacBook Pro',
      category: 'Electronics',
      price: 1999.99,
      costPrice: 1799.99,
      location: 'Warehouse A',
      createdAt: '2023-06-01T10:00:00Z',
      updatedAt: '2023-06-10T15:30:00Z'
    },
    { 
      id: '2', 
      name: 'Samsung Monitor', 
      quantity: 3, 
      threshold: 10,
      sku: 'SM-2023',
      description: 'Samsung Ultra-wide Monitor',
      category: 'Electronics',
      price: 599.99,
      costPrice: 499.99,
      location: 'Warehouse B',
      createdAt: '2023-06-02T11:00:00Z',
      updatedAt: '2023-06-11T16:30:00Z'
    },
    { 
      id: '3', 
      name: 'Desk Chair', 
      quantity: 4, 
      threshold: 8,
      sku: 'DC-2023',
      description: 'Ergonomic Desk Chair',
      category: 'Furniture',
      price: 299.99,
      costPrice: 249.99,
      location: 'Warehouse A',
      createdAt: '2023-06-03T12:00:00Z',
      updatedAt: '2023-06-12T17:30:00Z'
    },
  ]);

  // Define recentMovements with correct StockMovement type
  const [recentMovements] = useState<StockMovement[]>([
    { id: '1', productId: 'p1', productName: 'Desk Chair', type: 'in', quantity: 10, date: '2023-06-12T15:30:00Z', reason: 'restock', performedBy: 'user1' },
    { id: '2', productId: 'p2', productName: 'Desk Lamp', type: 'out', quantity: 5, date: '2023-06-11T13:45:00Z', reason: 'sale', performedBy: 'user2' },
    { id: '3', productId: 'p3', productName: 'Notebook', type: 'in', quantity: 50, date: '2023-06-10T09:20:00Z', reason: 'restock', performedBy: 'user1' },
    { id: '4', productId: 'p4', productName: 'Monitor', type: 'out', quantity: 8, date: '2023-06-09T14:15:00Z', reason: 'sale', performedBy: 'user3' },
    { id: '5', productId: 'p5', productName: 'Keyboard', type: 'out', quantity: 12, date: '2023-06-08T11:30:00Z', reason: 'sale', performedBy: 'user2' },
    { id: '6', productId: 'p6', productName: 'Mouse', type: 'in', quantity: 25, date: '2023-06-07T10:00:00Z', reason: 'restock', performedBy: 'user1' },
  ]);

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/wizard')} className="gap-2">
            <Wand2 className="h-4 w-4" />
            Setup Wizard
          </Button>
        </div>
      </div>

      <LowStockAlert products={lowStockProducts} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard 
          title="Total Inventory"
          value="1,234"
          icon={<Package className="h-4 w-4" />}
          change={{ value: "12%", positive: true }}
        />
        <StatCard 
          title="New Customers"
          value="24"
          icon={<UserPlus className="h-4 w-4" />}
          change={{ value: "4", positive: true }}
        />
        <StatCard 
          title="Stock In"
          value="528"
          icon={<ArrowDown className="h-4 w-4" />}
          change={{ value: "Items received this month", positive: true }}
        />
        <StatCard 
          title="Stock Out"
          value="432"
          icon={<ArrowUp className="h-4 w-4" />}
          change={{ value: "Items dispatched this month", positive: false }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
            <CardDescription>Distribution by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductsChart data={productCategories} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Stock Movement Trend</CardTitle>
            <CardDescription>Inflow vs Outflow</CardDescription>
          </CardHeader>
          <CardContent>
            <StockTrendChart data={stockTrends} />
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Stock Movements</CardTitle>
            <CardDescription>Latest stock inflows and outflows</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentMovements movements={recentMovements} />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-24 flex-col" onClick={() => navigate('/customers/manage')}>
                <UserPlus className="h-6 w-6 mb-2" />
                <span>Add Customer</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col" onClick={() => navigate('/wizard')}>
                <Wand2 className="h-6 w-6 mb-2" />
                <span>Setup Wizard</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col" onClick={() => navigate('/rooms')}>
                <SquarePlus className="h-6 w-6 mb-2" />
                <span>Add Room</span>
              </Button>
              <Button variant="outline" className="h-24 flex-col" onClick={() => navigate('/units')}>
                <SquarePlus className="h-6 w-6 mb-2" />
                <span>Add Unit</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
