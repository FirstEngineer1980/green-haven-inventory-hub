
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Warehouse } from '@/types/warehouse';

interface WarehouseSettingsProps {
  warehouses: Warehouse[];
}

export const WarehouseSettings = ({ warehouses }: WarehouseSettingsProps) => {
  return (
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
  );
};
