
import React, { useState } from 'react';
import { useWizard } from '@/context/WizardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ListStep = () => {
  const { prevStep, nextStep, selectedCustomer } = useWizard();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: ''
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
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a list name.",
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
      
      <div className="space-y-4">
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
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            placeholder="Enter list description (optional)" 
            value={formData.description} 
            onChange={handleInputChange} 
            className="min-h-32" 
          />
        </div>
      </div>
      
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
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default ListStep;
