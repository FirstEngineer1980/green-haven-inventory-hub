
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

export const GeneralSettings = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveGeneralSettings = async () => {
    setIsSubmitting(true);
    try {
      const companyNameElement = document.getElementById('company-name') as HTMLInputElement;
      const taxIdElement = document.getElementById('tax-id') as HTMLInputElement;
      const addressElement = document.getElementById('address') as HTMLInputElement;
      const phoneElement = document.getElementById('phone') as HTMLInputElement;
      const emailElement = document.getElementById('email') as HTMLInputElement;

      await axios.put('/api/settings/company', {
        name: companyNameElement?.value,
        tax_id: taxIdElement?.value,
        address: addressElement?.value,
        phone: phoneElement?.value,
        email: emailElement?.value,
      });
      
      toast({
        title: "Settings saved",
        description: "Your company information has been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Save failed",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
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
            <Button onClick={handleSaveGeneralSettings} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
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
            <Button onClick={handleSaveGeneralSettings} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
