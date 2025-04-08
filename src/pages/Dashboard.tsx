
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import LowStockAlert from '@/components/dashboard/LowStockAlert';
import ProductsChart from '@/components/dashboard/ProductsChart';
import StockTrendChart from '@/components/dashboard/StockTrendChart';
import RecentMovements from '@/components/dashboard/RecentMovements';
import { Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { mockDashboardStats } from '@/data/mockData';

const Dashboard = () => {
  const { products, getLowStockProducts } = useProducts();
  const lowStockProducts = getLowStockProducts();
  
  // Calculate total inventory value
  const totalInventoryValue = products.reduce(
    (sum, product) => sum + (product.quantity * product.costPrice), 
    0
  );
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome to your inventory management dashboard</p>
      </div>
      
      {/* Low stock alerts */}
      <LowStockAlert products={lowStockProducts} />
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Products"
          value={products.length}
          icon={<Package className="w-5 h-5 text-gh-green" />}
          className="border-l-4 border-l-gh-green"
        />
        
        <StatCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          icon={<AlertTriangle className="w-5 h-5 text-yellow-500" />}
          className="border-l-4 border-l-yellow-500"
          valueClassName={lowStockProducts.length > 0 ? "text-yellow-600" : undefined}
        />
        
        <StatCard
          title="Inventory Value"
          value={`$${totalInventoryValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<DollarSign className="w-5 h-5 text-gh-blue" />}
          className="border-l-4 border-l-gh-blue"
        />
        
        <StatCard
          title="Monthly Trend"
          value="+8.5%"
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
          className="border-l-4 border-l-green-500"
          change={{ value: "2.1%", positive: true }}
        />
      </div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="gh-card lg:col-span-1">
          <ProductsChart data={mockDashboardStats.productsByCategory} />
        </div>
        
        <div className="gh-card lg:col-span-2">
          <StockTrendChart data={mockDashboardStats.stockTrend} />
        </div>
      </div>
      
      {/* Recent activity */}
      <div className="gh-card">
        <RecentMovements movements={mockDashboardStats.recentMovements} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
