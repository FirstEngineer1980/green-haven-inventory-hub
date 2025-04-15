
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Warehouse } from '@/types/warehouse';
import { useAuth } from '@/context/AuthContext';

// Mock warehouse data
const warehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Main Warehouse',
    address: '123 Storage Ave, Warehouse District',
    location: '123 Storage Ave, Warehouse District',
    capacity: 10000,
    currentCapacity: 7650,
    description: 'Primary storage facility',
    manager: 'John Smith',
    createdAt: new Date(2023, 0, 1).toISOString(),
    updatedAt: new Date(2023, 2, 15).toISOString()
  },
  {
    id: '2',
    name: 'Downtown Storage',
    address: '456 City Center, Downtown',
    location: '456 City Center, Downtown',
    capacity: 5000,
    currentCapacity: 3210,
    description: 'Central distribution point',
    manager: 'Emma Wilson',
    createdAt: new Date(2023, 0, 15).toISOString(),
    updatedAt: new Date(2023, 2, 10).toISOString()
  },
  {
    id: '3',
    name: 'North Distribution Center',
    address: '789 Industrial Pkwy, North District',
    location: '789 Industrial Pkwy, North District',
    capacity: 15000,
    currentCapacity: 9870,
    description: 'Regional distribution hub',
    manager: 'Michael Chen',
    createdAt: new Date(2023, 1, 1).toISOString(),
    updatedAt: new Date(2023, 2, 5).toISOString()
  }
];

const Settings = () => {
  const { currentUser } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [newProductNotifications, setNewProductNotifications] = useState(true);
  const [systemMaintenanceNotifications, setSystemMaintenanceNotifications] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="warehouses">Warehouses</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your company details and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="Green Haven" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax-id">Tax ID / Business Number</Label>
                    <Input id="tax-id" defaultValue="123-45-6789" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Green St, Eco City, EC 12345" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="(555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="info@greenhaven.example.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="cad">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-2">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Regional Settings</CardTitle>
                <CardDescription>Configure your time zone and date format preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Time Zone</Label>
                  <Select defaultValue="america_new_york">
                    <SelectTrigger>
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america_new_york">America/New York (UTC-5)</SelectItem>
                      <SelectItem value="america_chicago">America/Chicago (UTC-6)</SelectItem>
                      <SelectItem value="america_denver">America/Denver (UTC-7)</SelectItem>
                      <SelectItem value="america_los_angeles">America/Los Angeles (UTC-8)</SelectItem>
                      <SelectItem value="europe_london">Europe/London (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="mm_dd_yyyy">
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm_dd_yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd_mm_yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyy_mm_dd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-2">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure when and how you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when products fall below threshold
                    </p>
                  </div>
                  <Switch
                    checked={lowStockAlerts}
                    onCheckedChange={setLowStockAlerts}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">New Product Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new products are added
                    </p>
                  </div>
                  <Switch
                    checked={newProductNotifications}
                    onCheckedChange={setNewProductNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">System Maintenance</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about scheduled maintenance
                    </p>
                  </div>
                  <Switch
                    checked={systemMaintenanceNotifications}
                    onCheckedChange={setSystemMaintenanceNotifications}
                  />
                </div>
                
                <div className="pt-2">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Warehouse Settings */}
          <TabsContent value="warehouses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Management</CardTitle>
                <CardDescription>Configure your warehouses and storage locations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-end">
                  <Button>Add Warehouse</Button>
                </div>
                
                {warehouses.map(warehouse => (
                  <Card key={warehouse.id} className="mb-4">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                          <CardDescription>{warehouse.location}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Manager</p>
                          <p>{warehouse.manager}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                          <p>{warehouse.capacity.toLocaleString()} units</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Current Usage</p>
                          <p>{Math.round((warehouse.currentCapacity / warehouse.capacity) * 100)}% ({warehouse.currentCapacity.toLocaleString()} units)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* System Settings */}
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>View system details and configuration.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Version</p>
                    <p>Green Haven ERP v1.0.0</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p>April 8, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Database Status</p>
                    <p className="text-green-600">Connected</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">API Status</p>
                    <p className="text-green-600">Operational</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage your system data and backups.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm">Export inventory data for backup or reporting purposes.</p>
                  <div className="flex gap-3">
                    <Button variant="outline">Export Products</Button>
                    <Button variant="outline">Export Customers</Button>
                    <Button variant="outline">Export Movements</Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t mt-4">
                  <p className="text-sm">Import data from CSV or Excel files.</p>
                  <div className="mt-2">
                    <Button variant="outline">Import Data</Button>
                  </div>
                </div>
                
                {currentUser?.role === 'admin' && (
                  <div className="pt-4 border-t mt-4">
                    <p className="text-sm text-destructive font-medium">Danger Zone</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      The following actions cannot be undone.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="destructive">Reset System</Button>
                      <Button variant="destructive">Clear All Data</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
