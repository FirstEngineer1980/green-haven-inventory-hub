
import React, { useState } from 'react';
import { useWizard } from '@/context/WizardContext';
import { useUnits } from '@/context/UnitContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const UnitStep = () => {
  const { prevStep, nextStep, selectedRoom, addCreatedUnit } = useWizard();
  const { addUnit, units } = useUnits();
  const { toast } = useToast();
  
  const [unitForms, setUnitForms] = useState([{
    number: '',
    size: 0,
    sizeUnit: 'sqft' as 'sqft' | 'sqm' | 'm²',
    status: 'available' as 'available' | 'occupied' | 'maintenance',
    description: ''
  }]);
  
  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newForms = [...unitForms];
    
    newForms[index] = {
      ...newForms[index],
      [name]: name === 'size' ? parseInt(value) || 0 : value,
    };
    
    setUnitForms(newForms);
  };
  
  const handleSelectChange = (index: number, field: string, value: string) => {
    const newForms = [...unitForms];
    
    if (field === 'sizeUnit') {
      newForms[index].sizeUnit = value as 'sqft' | 'sqm' | 'm²';
    } else if (field === 'status') {
      newForms[index].status = value as 'available' | 'occupied' | 'maintenance';
    }
    
    setUnitForms(newForms);
  };
  
  const addUnitForm = () => {
    setUnitForms([...unitForms, {
      number: '',
      size: 0,
      sizeUnit: 'sqft',
      status: 'available',
      description: ''
    }]);
  };
  
  const removeUnitForm = (index: number) => {
    if (unitForms.length === 1) {
      toast({
        title: "Error",
        description: "You must have at least one unit.",
        variant: "destructive"
      });
      return;
    }
    
    const newForms = unitForms.filter((_, i) => i !== index);
    setUnitForms(newForms);
  };
  
  const handleSaveAndContinue = () => {
    // Validate required fields
    const hasEmptyNumber = unitForms.some(form => !form.number);
    if (hasEmptyNumber) {
      toast({
        title: "Validation Error",
        description: "Please enter a unit number for all units.",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedRoom) {
      toast({
        title: "Error",
        description: "No room selected. Please go back to Step 3.",
        variant: "destructive"
      });
      return;
    }
    
    // Add all units
    unitForms.forEach(form => {
      const unitData = {
        roomId: selectedRoom.id,
        number: form.number,
        size: form.size,
        sizeUnit: form.sizeUnit,
        status: form.status,
        description: form.description
      };
      
      addUnit(unitData);
      
      // Find the newly created unit
      const latestUnits = units.filter(unit => unit.roomId === selectedRoom.id);
      const newUnit = latestUnits[latestUnits.length - 1];
      
      // Add to created units in wizard context
      if (newUnit) {
        addCreatedUnit(newUnit);
      }
    });
    
    toast({
      title: "Success",
      description: `${unitForms.length} unit(s) created for room ${selectedRoom.name}`,
      variant: "default"
    });
    
    // Proceed to next step
    nextStep();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Step 4: Create Units</h2>
        <p className="text-muted-foreground">Create units for room {selectedRoom?.name}</p>
      </div>
      
      <div className="space-y-4">
        {unitForms.map((unit, index) => (
          <Card key={index} className="border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Unit #{index + 1}</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeUnitForm(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`number-${index}`}>Unit Number <span className="text-red-500">*</span></Label>
                  <Input 
                    id={`number-${index}`}
                    name="number"
                    placeholder="Enter unit number" 
                    value={unit.number} 
                    onChange={(e) => handleInputChange(index, e)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`size-${index}`}>Size</Label>
                  <div className="flex gap-2">
                    <Input 
                      id={`size-${index}`}
                      name="size"
                      type="number" 
                      placeholder="Size" 
                      value={unit.size.toString()} 
                      onChange={(e) => handleInputChange(index, e)} 
                      className="flex-1"
                    />
                    <Select 
                      value={unit.sizeUnit} 
                      onValueChange={(value) => handleSelectChange(index, 'sizeUnit', value)}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sqft">sq ft</SelectItem>
                        <SelectItem value="sqm">sq m</SelectItem>
                        <SelectItem value="m²">m²</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`status-${index}`}>Status</Label>
                  <Select 
                    value={unit.status} 
                    onValueChange={(value) => handleSelectChange(index, 'status', value)}
                  >
                    <SelectTrigger id={`status-${index}`}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Textarea 
                    id={`description-${index}`}
                    name="description"
                    placeholder="Unit description (optional)" 
                    value={unit.description} 
                    onChange={(e) => handleInputChange(index, e)} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button 
          variant="outline" 
          onClick={addUnitForm}
          className="w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Another Unit
        </Button>
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

export default UnitStep;
