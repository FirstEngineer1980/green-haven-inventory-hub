
import React, { useState } from 'react';
import { useWizard } from '@/context/WizardContext';
import { useRooms } from '@/context/RoomContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Plus, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Room } from '@/types';

const RoomStep = () => {
  const { prevStep, nextStep, selectedCustomer, addCreatedRoom, createdRooms } = useWizard();
  const { addRoom, rooms } = useRooms();
  const { toast } = useToast();
  
  const [roomForms, setRoomForms] = useState<{ name: string; unit: number }[]>([
    { name: '', unit: 0 }
  ]);
  
  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newForms = [...roomForms];
    newForms[index] = {
      ...newForms[index],
      [name]: name === 'unit' ? parseInt(value) || 0 : value,
    };
    setRoomForms(newForms);
  };
  
  const addRoomForm = () => {
    setRoomForms([...roomForms, { name: '', unit: 0 }]);
  };

  const removeRoomForm = (index: number) => {
    if (roomForms.length === 1) {
      toast({
        title: "Error",
        description: "You must have at least one room.",
        variant: "destructive"
      });
      return;
    }
    const newForms = roomForms.filter((_, i) => i !== index);
    setRoomForms(newForms);
  };
  
  const handleSaveAndContinue = () => {
    // Validate required fields
    const hasEmptyName = roomForms.some(form => !form.name);
    if (hasEmptyName) {
      toast({
        title: "Validation Error",
        description: "Please enter a name for all rooms.",
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
    
    // Add all rooms
    roomForms.forEach(form => {
      // Add new room
      addRoom({
        customerId: selectedCustomer.id,
        name: form.name,
        unit: form.unit
      });
      
      // Find the newly created room
      const latestRooms = rooms.filter(room => room.customerId === selectedCustomer.id);
      const newRoom = latestRooms[latestRooms.length - 1];
      
      // Add to created rooms in wizard context
      if (newRoom) {
        addCreatedRoom(newRoom);
      }
    });
    
    toast({
      title: "Success",
      description: `${roomForms.length} room(s) created for customer ${selectedCustomer.name}`,
      variant: "default"
    });
    
    // Proceed to next step
    nextStep();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Step 3: Create Room</h2>
        <p className="text-muted-foreground">Create rooms for customer {selectedCustomer?.name}</p>
      </div>
      
      <div className="space-y-4">
        {roomForms.map((room, index) => (
          <Card key={index} className="border border-gray-200">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Room #{index + 1}</h3>
                {roomForms.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRoomForm(index)}
                    className="text-red-500"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`name-${index}`}>Room Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id={`name-${index}`}
                    name="name"
                    placeholder="Enter room name"
                    value={room.name}
                    onChange={(e) => handleInputChange(index, e)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`unit-${index}`}>Unit Number</Label>
                  <Input 
                    id={`unit-${index}`}
                    name="unit"
                    type="number"
                    placeholder="Enter unit number"
                    value={room.unit.toString()}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button 
          variant="outline" 
          onClick={addRoomForm}
          className="w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Another Room
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

export default RoomStep;
