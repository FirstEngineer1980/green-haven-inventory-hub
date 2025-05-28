import React, { useState } from 'react';
import { useWizard } from '@/context/WizardContext';
import { useUnits } from '@/context/UnitContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UnitStep = () => {
  const { prevStep, nextStep, createdRooms } = useWizard();
  const { addUnit } = useUnits();
  const { toast } = useToast();
  
  const [unitForms, setUnitForms] = useState<{ 
    name: string; 
    number: string; 
    roomId: string; 
    size: number; 
    sizeUnit: 'sqft' | 'sqm' | 'm²'; 
    status: 'available' | 'occupied' | 'maintenance'; 
    description: string; 
  }[]>([
    { 
      name: '', 
      number: '', 
      roomId: createdRooms[0]?.id || '', 
      size: 0, 
      sizeUnit: 'sqft', 
      status: 'available', 
      description: '' 
    }
  ]);
  
  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newForms = [...unitForms];
    newForms[index] = {
      ...newForms[index],
      [name]: value,
    };
    setUnitForms(newForms);
  };
  
  const handleSelectChange = (index: number, name: string, value: string) => {
    const newForms = [...unitForms];
    newForms[index] = {
      ...newForms[index],
      [name]: value,
    };
    setUnitForms(newForms);
  };
  
  const addUnitForm = () => {
    setUnitForms([
      ...unitForms,
      { 
        name: '', 
        number: '', 
        roomId: createdRooms[0]?.id || '', 
        size: 0, 
        sizeUnit: 'sqft', 
        status: 'available', 
        description: '' 
      }
    ]);
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
    const hasEmptyName = unitForms.some(form => !form.name);
    if (hasEmptyName) {
      toast({
        title: "Validation Error",
        description: "Please enter a name for all units.",
        variant: "destructive"
      });
      return;
    }
    
    if (createdRooms.length === 0) {
      toast({
        title: "Error", 
        description: "No rooms available. Please go back and create rooms first.",
        variant: "destructive"
      });
      return;
    }
    
    // Add all units
    unitForms.forEach(form => {
      // Add new unit with all required properties
      addUnit({
        name: form.name,
        number: form.number,
        roomId: form.roomId,
        capacity: form.size, // Use size as capacity
        currentStock: 0, // Initialize with zero stock
        size: form.size,
        sizeUnit: form.sizeUnit,
        status: form.status,
        description: form.description
      });
    });
    
    toast({
      title: "Success",
      description: `${unitForms.length} unit(s) created`,
      variant: "default"
    });
    
    // Proceed to next step
    nextStep();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Step 4: Create Unit</h2>
        <p className="text-muted-foreground">Create units for the rooms</p>
      </div>
      
      <div className="space-y-4">
        {unitForms.map((unit, index) => (
          <Card key={index} className="border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Unit #{index + 1}</h3>
                {unitForms.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeUnitForm(index)}
                    className="text-red-500"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${index}`}>Unit Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id={`name-${index}`}
                    name="name"
                    placeholder="Enter unit name"
                    value={unit.name}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`number-${index}`}>Unit Number</Label>
                  <Input 
                    id={`number-${index}`}
                    name="number"
                    placeholder="Enter unit number"
                    value={unit.number}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`roomId-${index}`}>Room</Label>
                  <Select
                    value={unit.roomId}
                    onValueChange={(value) => handleSelectChange(index, 'roomId', value)}
                  >
                    <SelectTrigger id={`roomId-${index}`}>
                      <SelectValue placeholder="Select a room" />
                    </SelectTrigger>
                    <SelectContent>
                      {createdRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`size-${index}`}>Size</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id={`size-${index}`}
                      name="size"
                      type="number"
                      placeholder="Enter size"
                      value={unit.size}
                      onChange={(e) => handleInputChange(index, e)}
                      className="w-32"
                    />
                    <Select
                      value={unit.sizeUnit}
                      onValueChange={(value) => handleSelectChange(index, 'sizeUnit', value)}
                    >
                      <SelectTrigger id={`sizeUnit-${index}`}>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sqft">sqft</SelectItem>
                        <SelectItem value="sqm">sqm</SelectItem>
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
                
                <div className="space-y-2">
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Input 
                    id={`description-${index}`}
                    name="description"
                    placeholder="Enter description"
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
