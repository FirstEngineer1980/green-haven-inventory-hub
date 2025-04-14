
import React, { useState } from 'react';
import { useWizard } from '@/context/WizardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const ListStep = () => {
  const { prevStep, nextStep, selectedCustomer } = useWizard();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    quantity: '',
    description: '',
    picture: '',
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
    if (!formData.name || !formData.sku || !formData.quantity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would add this list to the database
    toast({
      title: "Success",
      description: `List "${formData.name}" created for customer ${selectedCustomer?.name}`,
      variant: "default"
    });
    
    // Proceed to next step
    nextStep();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Step 2: Create List</h2>
        <p className="text-muted-foreground">Create a new list for customer {selectedCustomer?.name}</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">List Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="name" 
                  name="name" 
                  placeholder="Enter list name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sku">SKU <span className="text-red-500">*</span></Label>
                <Input 
                  id="sku" 
                  name="sku" 
                  placeholder="Enter SKU" 
                  value={formData.sku} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity <span className="text-red-500">*</span></Label>
                <Input 
                  id="quantity" 
                  name="quantity" 
                  type="number" 
                  placeholder="Enter quantity" 
                  value={formData.quantity} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="picture">Picture URL</Label>
                <Input 
                  id="picture" 
                  name="picture" 
                  placeholder="Enter picture URL (optional)" 
                  value={formData.picture} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Enter description (optional)" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  className="resize-none min-h-[100px]" 
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
                  className="resize-none min-h-[100px]" 
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button 
          onClick={handleSaveAndContinue}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save and Continue
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ListStep;
