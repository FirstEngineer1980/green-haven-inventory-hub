
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

export const NotificationSettings = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [newProductNotifications, setNewProductNotifications] = useState(true);
  const [systemMaintenanceNotifications, setSystemMaintenanceNotifications] = useState(false);

  const handleSaveNotificationPreferences = async () => {
    setIsSubmitting(true);
    try {
      await axios.put('/api/settings/notifications', {
        email_notifications: emailNotifications,
        low_stock_alerts: lowStockAlerts,
        new_product_notifications: newProductNotifications,
        system_maintenance_notifications: systemMaintenanceNotifications,
      });
      
      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Save failed",
        description: "There was an error saving your preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
          <Button onClick={handleSaveNotificationPreferences} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
