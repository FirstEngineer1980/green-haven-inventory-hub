
import React, { useState } from 'react';
import { useWizard } from '@/context/WizardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const SkuMatrixStep = () => {
  const { prevStep, nextStep, selectedRoom, createdUnits } = useWizard();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    productCount: 1,
    unitCount: createdUnits.length
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'productCount' ? Math.max(1, parseInt(value) || 1) : value,
    }));
  };
  
  const handleSaveAndContinue = () => {
    // Validate required fields
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a matrix name.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Success",
      description: `SKU matrix "${formData.name}" created for ${createdUnits.length} units`,
      variant: "default"
    });
    
    // Proceed to next step
    nextStep();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Step 5: Create SKU Matrix</h2>
        <p className="text-muted-foreground">Create a SKU matrix for room {selectedRoom?.name}</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Matrix Name <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Enter matrix name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                name="description" 
                placeholder="Enter description (optional)" 
                value={formData.description} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="productCount">Number of Products</Label>
              <Input 
                id="productCount" 
                name="productCount" 
                type="number" 
                min="1"
                placeholder="Enter number of products" 
                value={formData.productCount.toString()} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Units</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {createdUnits.map((unit, index) => (
                  <div key={index} className="bg-muted p-2 rounded flex items-center">
                    <span className="text-sm">{unit.number}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {createdUnits.length} unit(s) will be included in the matrix
              </p>
            </div>
          </div>
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
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default SkuMatrixStep;
