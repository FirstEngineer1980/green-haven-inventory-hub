
import React, { useState } from 'react';
import { useWizard } from '@/context/WizardContext';
import { useRooms } from '@/context/RoomContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RoomStep = () => {
  const { prevStep, nextStep, selectedCustomer, setSelectedRoom } = useWizard();
  const { addRoom, rooms } = useRooms();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    unit: 0
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'unit' ? parseInt(value) || 0 : value,
    }));
  };
  
  const handleSaveAndContinue = () => {
    // Validate required fields
    if (!formData.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a room name.",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedCustomer) {
      toast({
        title: "Error",
        description: "No customer selected. Please go back to Step 1.",
        variant: "destructive"
      });
      return;
    }
    
    // Add new room
    addRoom({
      customerId: selectedCustomer.id,
      name: formData.name,
      unit: formData.unit
    });
    
    // Find the newly created room (it will be the latest one)
    const latestRooms = rooms.filter(room => room.customerId === selectedCustomer.id);
    const newRoom = latestRooms[latestRooms.length - 1];
    
    // Set the selected room
    setSelectedRoom(newRoom);
    
    toast({
      title: "Success",
      description: `Room "${formData.name}" created for customer ${selectedCustomer.name}`,
      variant: "default"
    });
    
    // Proceed to next step
    nextStep();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Step 3: Create Room</h2>
        <p className="text-muted-foreground">Create a new room for customer {selectedCustomer?.name}</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Room Name <span className="text-red-500">*</span></Label>
          <Input 
            id="name" 
            name="name" 
            placeholder="Enter room name" 
            value={formData.name} 
            onChange={handleInputChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unit">Unit Number</Label>
          <Input 
            id="unit" 
            name="unit" 
            type="number" 
            placeholder="Enter unit number" 
            value={formData.unit.toString()} 
            onChange={handleInputChange} 
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

export default RoomStep;
