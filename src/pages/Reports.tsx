
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useProducts } from '@/context/ProductContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Printer, Download, Calendar, BarChart2, PieChart, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RePieChart, Pie, Cell, LineChart as ReLineChart, Line } from 'recharts';

const COLORS = ['#6bacde', '#74c696', '#e5ab7d', '#e27a7a', '#9b7ade'];

const Reports = () => {
  const { products, stockMovements } = useProducts();
  const [activeTab, setActiveTab] = useState('inventory');

  // Calculate total inventory value
  const totalInventoryValue = products.reduce((total, product) => {
    return total + (product.price * product.quantity);
  }, 0);

  // Generate product category data
  const categoryData = products.reduce((acc, product) => {
    const existingCategory = acc.find(cat => cat.name === product.category);
    if (existingCategory) {
      existingCategory.value += 1;
    } else {
      acc.push({ name: product.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Generate stock movement data (last 7 days)
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  // Generate dummy stock trend data
  const stockTrendData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - 6 + i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Find movements for this day
    const movementsOnDay = stockMovements.filter(movement => {
      const movementDate = new Date(movement.date);
      return movementDate.toDateString() === date.toDateString();
    });
    
    const stockIn = movementsOnDay
      .filter(m => m.type === 'in')
      .reduce((sum, m) => sum + m.quantity, 0);
      
    const stockOut = movementsOnDay
      .filter(m => m.type === 'out')
      .reduce((sum, m) => sum + m.quantity, 0);
    
    return {
      date: dateStr,
      stockIn,
      stockOut
    };
  });

  // Calculate stock value by location
  const locationData = products.reduce((acc, product) => {
    const existingLocation = acc.find(loc => loc.name === product.location);
    const value = product.price * product.quantity;
    
    if (existingLocation) {
      existingLocation.value += value;
    } else {
      acc.push({ name: product.location, value });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  return (
    <DashboardLayout requiredPermission="view_reports">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Date Range
            </Button>
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="inventory" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory" className="gap-2">
              <BarChart2 className="h-4 w-4" />
              Inventory Reports
            </TabsTrigger>
            <TabsTrigger value="movements" className="gap-2">
              <LineChart className="h-4 w-4" />
              Stock Movements
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <PieChart className="h-4 w-4" />
              Categories & Locations
            </TabsTrigger>
          </TabsList>
          
          {/* Inventory Reports Tab */}
          <TabsContent value="inventory" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{products.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Inventory Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">${totalInventoryValue.toFixed(2)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Low Stock Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {products.filter(p => p.quantity <= p.threshold).length}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Products by Value</CardTitle>
                <CardDescription>Inventory value distribution by product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={products
                        .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
                        .slice(0, 5)
                        .map(product => ({
                          name: product.name,
                          value: product.price * product.quantity
                        }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Value']} />
                      <Bar dataKey="value" fill="#6bacde" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Stock Movements Tab */}
          <TabsContent value="movements" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Stock Movement Trends</CardTitle>
                <CardDescription>Last 7 days of stock movements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart
                      data={stockTrendData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="stockIn" stroke="#74c696" name="Stock In" />
                      <Line type="monotone" dataKey="stockOut" stroke="#e27a7a" name="Stock Out" />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Stock Movement Summary</CardTitle>
                <CardDescription>Stock in vs. stock out analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Stock In by Reason</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Purchase', value: 35 },
                              { name: 'Return', value: 12 },
                              { name: 'Adjustment', value: 8 },
                              { name: 'Transfer', value: 15 }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [value, 'Quantity']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Stock Out by Reason</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Sale', value: 42 },
                              { name: 'Damage', value: 8 },
                              { name: 'Expired', value: 5 },
                              { name: 'Transfer', value: 15 }
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [value, 'Quantity']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Categories & Locations Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Products by Category</CardTitle>
                  <CardDescription>Distribution of products across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Products']} />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Value by Location</CardTitle>
                  <CardDescription>Distribution of inventory value across locations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={locationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {locationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Value']} />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Categories by Value</CardTitle>
                <CardDescription>Inventory value distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.entries(products.reduce((acc, product) => {
                        const value = product.price * product.quantity;
                        acc[product.category] = (acc[product.category] || 0) + value;
                        return acc;
                      }, {} as Record<string, number>))
                        .map(([name, value]) => ({ name, value }))
                        .sort((a, b) => b.value - a.value)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Value']} />
                      <Bar dataKey="value" fill="#74c696" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end">
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Generate Full Report
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
