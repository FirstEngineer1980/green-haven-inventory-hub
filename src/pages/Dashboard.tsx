
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CONFIG } from 'src/config-global';
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
import { apiInstance } from '@/api/services/api';

const Dashboard = () => {
  const navigate = useNavigate();

  // Fetch dashboard stats from backend
  const { data: dashboardStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await apiInstance.get('/dashboard/stats');
      return response.data;
    },
  });

  // Fetch low stock products from backend
  const { data: lowStockData } = useQuery({
    queryKey: ['dashboard-low-stock'],
    queryFn: async () => {
      const response = await apiInstance.get('/dashboard/low-stock');
      return response.data.data || [];
    },
  });

  // Fetch recent movements from backend
  const { data: recentMovementsData } = useQuery({
    queryKey: ['dashboard-recent-movements'],
    queryFn: async () => {
      const response = await apiInstance.get('/dashboard/recent-movements');
      return response.data.data || [];
    },
  });

  // Transform low stock data to match frontend Product type
  const lowStockProducts: Product[] = (lowStockData || []).map((item: any) => ({
    id: item.id.toString(),
    name: item.name,
    sku: item.sku || '',
    description: item.description || '',
    category: item.category?.name || '',
    price: 0,
    costPrice: 0,
    quantity: item.quantity,
    threshold: item.threshold,
    location: '',
    image: '',
    createdAt: item.created_at || new Date().toISOString(),
    updatedAt: item.updated_at || new Date().toISOString(),
  }));

  // Transform recent movements data
  const recentMovements: StockMovement[] = (recentMovementsData || []).map((item: any) => ({
    id: item.id.toString(),
    productId: item.product_id?.toString() || '',
    productName: item.productName || '',
    type: item.type as 'in' | 'out',
    quantity: item.quantity,
    date: item.date,
    reason: 'movement',
    performedBy: item.performedBy || '',
    createdAt: item.date,
    userId: item.performed_by?.toString() || '',
  }));

  const [productCategories] = useState([
    { category: 'Electronics', count: 24 },
    { category: 'Furniture', count: 18 },
    { category: 'Office Supplies', count: 12 },
    { category: 'Kitchen', count: 9 },
    { category: 'Bathroom', count: 6 }
  ]);

  const [stockTrends] = useState([
    { date: '2023-01-15T00:00:00Z', inStock: 65 },
    { date: '2023-02-15T00:00:00Z', inStock: 78 },
    { date: '2023-03-15T00:00:00Z', inStock: 82 },
    { date: '2023-04-15T00:00:00Z', inStock: 70 },
    { date: '2023-05-15T00:00:00Z', inStock: 85 },
    { date: '2023-06-15T00:00:00Z', inStock: 90 },
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
          title="Total Products"
          value={dashboardStats?.totalProducts?.toString() || "0"}
          icon={<Package className="h-4 w-4" />}
          change={{ value: "12%", positive: true }}
        />
        <StatCard 
          title="Low Stock Items"
          value={dashboardStats?.lowStockCount?.toString() || "0"}
          icon={<UserPlus className="h-4 w-4" />}
          change={{ value: "Items below threshold", positive: false }}
        />
        <StatCard 
          title="Total Value"
          value={`$${dashboardStats?.totalValue?.toFixed(2) || "0.00"}`}
          icon={<ArrowDown className="h-4 w-4" />}
          change={{ value: "Inventory value", positive: true }}
        />
        <StatCard 
          title="Monthly Movements"
          value={dashboardStats?.monthlyMovements?.toString() || "0"}
          icon={<ArrowUp className="h-4 w-4" />}
          change={{ value: "This month", positive: false }}
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
