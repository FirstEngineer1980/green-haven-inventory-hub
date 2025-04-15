import React, { useState } from 'react';
import { useWizard } from '@/context/WizardContext';
import { useCustomers } from '@/context/CustomerContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ClientStep = () => {
  const { nextStep, setSelectedCustomer } = useWizard();
  const { addCustomer, customers } = useCustomers();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    notes: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveAndContinue = () => {
    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Add new customer
    const customerData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      company: formData.company,
      notes: formData.notes,
      contact: formData.name // Set contact to name for compatibility
    };
    
    addCustomer(customerData);
    
    // Find the newly created customer (it will be the latest one)
    const newCustomer = customers[customers.length - 1];
    
    // Set the selected customer
    setSelectedCustomer(newCustomer);
    
    toast({
      title: "Success",
      description: "Customer added successfully!",
      variant: "default"
    });
    
    // Proceed to next step
    nextStep();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Step 1: Add Client</h2>
        <p className="text-muted-foreground">Enter the client's information to get started.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
          <Input 
            id="name" 
            name="name" 
            placeholder="Full name" 
            value={formData.name} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="Email address" 
            value={formData.email} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
          <Input 
            id="phone" 
            name="phone" 
            placeholder="Phone number" 
            value={formData.phone} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input 
            id="company" 
            name="company" 
            placeholder="Company name (optional)" 
            value={formData.company} 
            onChange={handleInputChange} 
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
          <Input 
            id="address" 
            name="address" 
            placeholder="Full address" 
            value={formData.address} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea 
            id="notes" 
            name="notes" 
            placeholder="Additional notes (optional)" 
            value={formData.notes} 
            onChange={handleInputChange} 
            className="min-h-32" 
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveAndContinue}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save and Continue
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default ClientStep;
