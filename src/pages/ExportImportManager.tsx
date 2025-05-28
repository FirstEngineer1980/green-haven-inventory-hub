
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, Upload, History, FileText } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BackendExportButton from '@/components/shared/BackendExportButton';
import BackendImportButton from '@/components/shared/BackendImportButton';
import { exportImportService } from '@/api/services/exportImportService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const ExportImportManager = () => {
  const { toast } = useToast();

  const { data: exportLogs = [], refetch: refetchLogs } = useQuery({
    queryKey: ['export-logs'],
    queryFn: exportImportService.getExportLogs,
  });

  const handleImportSuccess = () => {
    toast({
      title: "Import successful",
      description: "Data has been imported successfully",
      variant: "default",
    });
    refetchLogs();
  };

  const exportTypes = [
    {
      type: 'products',
      title: 'Products',
      description: 'Export all product data including SKUs, prices, and inventory',
      fields: ['id', 'name', 'sku', 'description', 'category', 'price', 'costPrice', 'quantity', 'threshold', 'location', 'image']
    },
    {
      type: 'categories',
      title: 'Categories',
      description: 'Export product categories and their descriptions',
      fields: ['id', 'name', 'description', 'productCount']
    },
    {
      type: 'customers',
      title: 'Customers',
      description: 'Export customer information and contact details',
      fields: ['id', 'name', 'email', 'phone', 'address', 'company']
    },
    {
      type: 'rooms',
      title: 'Rooms',
      description: 'Export room configurations and assignments',
      fields: ['id', 'name', 'customerId', 'description', 'capacity']
    },
    {
      type: 'units',
      title: 'Units',
      description: 'Export storage unit details and availability',
      fields: ['id', 'roomId', 'number', 'size', 'sizeUnit', 'status', 'description']
    },
    {
      type: 'sellers',
      title: 'Sellers',
      description: 'Export seller profiles and information',
      fields: ['id', 'name', 'email', 'phone', 'territory', 'hire_date']
    },
    {
      type: 'clients',
      title: 'Clients',
      description: 'Export client accounts and business details',
      fields: ['id', 'name', 'email', 'company', 'industry', 'status']
    },
    {
      type: 'seller-commissions',
      title: 'Seller Commissions',
      description: 'Export commission structures and rates',
      fields: ['id', 'seller_id', 'client_id', 'commission_tiers', 'is_active']
    },
    {
      type: 'users',
      title: 'Users',
      description: 'Export system users and their roles',
      fields: ['id', 'name', 'email', 'role', 'permissions', 'created_at']
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Export & Import Manager</h1>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <span className="text-sm text-muted-foreground">Data Management</span>
          </div>
        </div>

        <Tabs defaultValue="export" className="space-y-6">
          <TabsList>
            <TabsTrigger value="export">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </TabsTrigger>
            <TabsTrigger value="import">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              Export History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exportTypes.map((exportType) => (
                <Card key={exportType.type}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {exportType.title}
                      <Badge variant="outline">{exportType.type}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {exportType.description}
                    </p>
                    <BackendExportButton
                      type={exportType.type}
                      availableFields={exportType.fields}
                      label={`Export ${exportType.title}`}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exportTypes.map((exportType) => (
                <Card key={exportType.type}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {exportType.title}
                      <Badge variant="outline">{exportType.type}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {exportType.description}
                    </p>
                    <BackendImportButton
                      type={exportType.type}
                      onSuccess={handleImportSuccess}
                      label={`Import ${exportType.title}`}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Filename</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Exported By</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exportLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No export history found
                        </TableCell>
                      </TableRow>
                    ) : (
                      exportLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <Badge variant="outline">{log.type}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{log.filename}</TableCell>
                          <TableCell>{log.record_count}</TableCell>
                          <TableCell>{log.user?.name || 'Unknown'}</TableCell>
                          <TableCell>
                            {format(new Date(log.exported_at), 'MMM dd, yyyy HH:mm')}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ExportImportManager;
