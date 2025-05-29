
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  TooltipProps
} from 'recharts';
import { Calendar as CalendarIcon, Download, FileText, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/context/AuthContext';
import { useReports } from '@/context/ReportContext';
import { useInventory } from '@/context/InventoryContext';
import { useCustomers } from '@/context/CustomerContext';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

const COLORS = ['#74c696', '#6bacde', '#F4C430', '#FF6B6B', '#9775fa', '#5D5FEF'];

const Reports = () => {
  const { hasPermission } = useAuth();
  const { reports = [], loading: reportsLoading, runReport } = useReports();
  const { inventoryItems = [] } = useInventory();
  const { customers = [] } = useCustomers();
  
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reportType, setReportType] = useState("inventory");
  const [timeRange, setTimeRange] = useState("lastMonth");
  
  if (!hasPermission('view_reports')) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Access Restricted</h1>
            <p className="text-gray-500">You don't have permission to view reports.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Transform inventory data for charts - with safety check
  const stockLevelData = (inventoryItems || []).map(item => ({
    name: item.productName || `Product ${item.productId}`,
    value: item.quantity,
    category: 'General'
  }));

  // Generate mock sales data (this would come from actual sales API)
  const salesByMonthData = [
    { name: 'Jan', sales: 4000, expenses: 2400 },
    { name: 'Feb', sales: 3000, expenses: 1398 },
    { name: 'Mar', sales: 9800, expenses: 2000 },
    { name: 'Apr', sales: 3908, expenses: 2780 },
    { name: 'May', sales: 4800, expenses: 1890 },
    { name: 'Jun', sales: 3800, expenses: 2390 },
    { name: 'Jul', sales: 4300, expenses: 3490 },
    { name: 'Aug', sales: 5300, expenses: 3000 },
    { name: 'Sep', sales: 4500, expenses: 2500 },
    { name: 'Oct', sales: 5200, expenses: 2800 },
    { name: 'Nov', sales: 6600, expenses: 3200 },
    { name: 'Dec', sales: 8200, expenses: 3800 }
  ];

  const categorySalesData = [
    { name: 'Fertilizers', value: 35 },
    { name: 'Plant Care', value: 25 },
    { name: 'Soils', value: 20 },
    { name: 'Seeds', value: 10 },
    { name: 'Tools', value: 10 }
  ];

  // Transform customer data for charts - with safety check
  const customerRevenueData = (customers || []).slice(0, 5).map((customer, index) => ({
    name: customer.name,
    revenue: Math.floor(Math.random() * 10000) + 1000,
    orders: Math.floor(Math.random() * 20) + 5
  }));

  const warehouseUtilizationData = [
    { name: 'Main Warehouse', total: 5000, used: 3800 },
    { name: 'East Storage', total: 3000, used: 1500 },
    { name: 'West Storage', total: 2500, used: 2000 },
    { name: 'South Annex', total: 1800, used: 900 }
  ];

  const formatNumber = (value: ValueType) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value;
  };

  const handleRunReport = async (reportId: string) => {
    try {
      await runReport(reportId);
    } catch (error) {
      console.error('Failed to run report:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          
          <div className="flex gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal w-[240px]",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="inventory">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="inventory" onClick={() => setReportType("inventory")}>Inventory</TabsTrigger>
            <TabsTrigger value="sales" onClick={() => setReportType("sales")}>Sales</TabsTrigger>
            <TabsTrigger value="customers" onClick={() => setReportType("customers")}>Customers</TabsTrigger>
            <TabsTrigger value="warehouse" onClick={() => setReportType("warehouse")}>Warehouse</TabsTrigger>
          </TabsList>
          
          {/* Inventory Reports Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Stock Levels</CardTitle>
                  <CardDescription>Total inventory by product</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stockLevelData.slice(0, 8)}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <RechartsTooltip 
                          formatter={(value: ValueType) => {
                            return [`${formatNumber(value)} units`, 'Stock'];
                          }}
                        />
                        <Bar dataKey="value" fill="#74c696" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Stock by Category</CardTitle>
                  <CardDescription>Percentage breakdown of inventory by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categorySalesData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categorySalesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value: ValueType) => {
                            return [`${formatNumber(value)}%`, 'Percentage'];
                          }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Inventory Valuation Report</CardTitle>
                    <CardDescription>Overview of product values in stock</CardDescription>
                  </div>
                  <Button variant="outline" className="h-8 gap-1">
                    <FileText className="h-4 w-4" />
                    <span>Generate PDF</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="py-3 px-4 text-left">Product</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-right">In Stock</th>
                        <th className="py-3 px-4 text-right">Unit Cost</th>
                        <th className="py-3 px-4 text-right">Total Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockLevelData.slice(0, 8).map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 px-4">{item.name}</td>
                          <td className="py-3 px-4">{(inventoryItems[index] && inventoryItems[index].status) || 'Available'}</td>
                          <td className="py-3 px-4 text-right">{item.value}</td>
                          <td className="py-3 px-4 text-right">$10.00</td>
                          <td className="py-3 px-4 text-right">${(item.value * 10).toLocaleString()}</td>
                        </tr>
                      ))}
                      <tr className="font-medium">
                        <td colSpan={4} className="py-3 px-4 text-right">Total Inventory Value:</td>
                        <td className="py-3 px-4 text-right">${stockLevelData.slice(0, 8).reduce((sum, item) => sum + (item.value * 10), 0).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Sales Reports Tab */}
          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle>Sales & Expenses Overview</CardTitle>
                      <CardDescription>Monthly sales trends</CardDescription>
                    </div>
                    <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select time range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lastMonth">Last Month</SelectItem>
                        <SelectItem value="last3Months">Last 3 Months</SelectItem>
                        <SelectItem value="last6Months">Last 6 Months</SelectItem>
                        <SelectItem value="lastYear">Last Year</SelectItem>
                        <SelectItem value="allTime">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesByMonthData}
                        margin={{
                          top: 5, right: 30, left: 20, bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <RechartsTooltip formatter={(value: ValueType) => {
                            return [`$${formatNumber(value)}`, 'Amount'];
                          }} />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#74c696" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="expenses" stroke="#6bacde" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Product Category</CardTitle>
                  <CardDescription>Distribution of sales across product categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categorySalesData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {categorySalesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>Most popular products by revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={stockLevelData.slice(0, 5).map(item => ({
                          name: item.name,
                          revenue: item.value * 15
                        }))}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <RechartsTooltip formatter={(value: ValueType) => {
                            return [`$${formatNumber(value)}`, 'Revenue'];
                          }} />
                        <Bar dataKey="revenue" fill="#6bacde" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Customers Reports Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Customers by Revenue</CardTitle>
                <CardDescription>Customers who generate the most revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={customerRevenueData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <RechartsTooltip formatter={(value: ValueType) => {
                            return [`$${formatNumber(value)}`, 'Revenue'];
                          }} />
                      <Bar dataKey="revenue" fill="#74c696" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Orders</CardTitle>
                  <CardDescription>Number of orders placed by top customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={customerRevenueData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <RechartsTooltip />
                        <Bar dataKey="orders" fill="#6bacde" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Customer Spending Analysis</CardTitle>
                  <CardDescription>Revenue per order for top customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left">Customer</th>
                          <th className="py-3 px-4 text-right">Total Orders</th>
                          <th className="py-3 px-4 text-right">Total Revenue</th>
                          <th className="py-3 px-4 text-right">Avg Revenue/Order</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerRevenueData.map((customer, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4">{customer.name}</td>
                            <td className="py-3 px-4 text-right">{customer.orders}</td>
                            <td className="py-3 px-4 text-right">${customer.revenue.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right">${(customer.revenue / customer.orders).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Warehouse Reports Tab */}
          <TabsContent value="warehouse" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Space Utilization</CardTitle>
                <CardDescription>Current storage capacity utilization across warehouses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={warehouseUtilizationData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip formatter={(value: ValueType) => {
                            return [`${formatNumber(value)} sq ft`, 'Space'];
                          }} />
                      <Legend />
                      <Bar dataKey="total" fill="#6bacde" name="Total Capacity" />
                      <Bar dataKey="used" fill="#74c696" name="Used Space" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Warehouse Utilization Percentage</CardTitle>
                  <CardDescription>Percentage of space used in each warehouse</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left">Warehouse</th>
                          <th className="py-3 px-4 text-right">Total Capacity</th>
                          <th className="py-3 px-4 text-right">Used Space</th>
                          <th className="py-3 px-4 text-right">Utilization %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {warehouseUtilizationData.map((warehouse, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4">{warehouse.name}</td>
                            <td className="py-3 px-4 text-right">{warehouse.total} sq ft</td>
                            <td className="py-3 px-4 text-right">{warehouse.used} sq ft</td>
                            <td className="py-3 px-4 text-right">{((warehouse.used / warehouse.total) * 100).toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Available Space</CardTitle>
                  <CardDescription>Remaining storage capacity by warehouse</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={warehouseUtilizationData.map(warehouse => ({
                            name: warehouse.name,
                            value: warehouse.total - warehouse.used
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, value }) => `${name}: ${value} sq ft`}
                        >
                          {warehouseUtilizationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value: ValueType) => {
                            return [`${formatNumber(value)} sq ft`, 'Available Space'];
                          }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Custom Reports Section */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Reports</CardTitle>
            <CardDescription>Run saved reports and analytics</CardDescription>
          </CardHeader>
          <CardContent>
            {reportsLoading ? (
              <div className="text-center py-4">Loading reports...</div>
            ) : (reports && reports.length > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((report) => (
                  <Card key={report.id} className="p-4">
                    <h3 className="font-medium mb-2">{report.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {report.lastRun ? `Last run: ${format(new Date(report.lastRun), 'MMM dd, yyyy')}` : 'Never run'}
                      </span>
                      <Button size="sm" onClick={() => handleRunReport(report.id)}>
                        Run Report
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No custom reports available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
