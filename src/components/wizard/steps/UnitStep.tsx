import React, { useState } from 'react';
import { useWizard } from '@/context/WizardContext';
import { useUnits } from '@/context/UnitContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronLeft, ChevronRight, Save, Plus, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Room } from '@/types';

const UnitStep = () => {
  const { prevStep, nextStep, createdRooms, addCreatedUnit } = useWizard();
  const { addUnit, units } = useUnits();
  const { toast } = useToast();
  
  // Initialize unitForms with an empty array for each room
  const [unitsByRoom, setUnitsByRoom] = useState<{
    [roomId: string]: {
      name: string;
      number: string;
      size: number;
      sizeUnit: 'sqft' | 'sqm' | 'm²';
      status: 'available' | 'occupied' | 'maintenance';
      description: string;
    }[];
  }>(
    createdRooms.reduce((acc, room) => ({
      ...acc,
      [room.id]: [{
        name: '',
        number: '',
        size: 0,
        sizeUnit: 'sqft',
        status: 'available',
        description: ''
      }]
    }), {})
  );
  
  const handleInputChange = (roomId: string, unitIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUnitsByRoom(prev => ({
      ...prev,
      [roomId]: prev[roomId].map((unit, idx) => 
        idx === unitIndex 
          ? { ...unit, [name]: name === 'size' ? parseInt(value) || 0 : value }
          : unit
      )
    }));
  };
  
  const handleSelectChange = (roomId: string, unitIndex: number, field: string, value: string) => {
    setUnitsByRoom(prev => ({
      ...prev,
      [roomId]: prev[roomId].map((unit, idx) => 
        idx === unitIndex 
          ? { ...unit, [field]: value }
          : unit
      )
    }));
  };
  
  const addUnitForm = (roomId: string) => {
    setUnitsByRoom(prev => ({
      ...prev,
      [roomId]: [...prev[roomId], {
        name: '',
        number: '',
        size: 0,
        sizeUnit: 'sqft',
        status: 'available',
        description: ''
      }]
    }));
  };
  
  const removeUnitForm = (roomId: string, index: number) => {
    if (unitsByRoom[roomId].length === 1) {
      toast({
        title: "Error",
        description: "Each room must have at least one unit.",
        variant: "destructive"
      });
      return;
    }
    
    setUnitsByRoom(prev => ({
      ...prev,
      [roomId]: prev[roomId].filter((_, i) => i !== index)
    }));
  };
  
  const handleSaveAndContinue = () => {
    // Validate all units have numbers
    let hasError = false;
    createdRooms.forEach(room => {
      const roomUnits = unitsByRoom[room.id];
      if (!roomUnits || roomUnits.some(unit => !unit.number)) {
        toast({
          title: "Validation Error",
          description: `Please enter unit numbers for all units in room "${room.name}"`,
          variant: "destructive"
        });
        hasError = true;
      }
    });
    
    if (hasError) return;
    
    // Add all units for all rooms
    createdRooms.forEach(room => {
      unitsByRoom[room.id].forEach(unitData => {
        // Set default name if empty
        if (!unitData.name) {
          unitData.name = `Unit ${unitData.number}`;
        }
        
        addUnit({
          roomId: room.id,
          ...unitData
        });
        
        // Find the newly created unit
        const latestUnits = units.filter(unit => unit.roomId === room.id);
        const newUnit = latestUnits[latestUnits.length - 1];
        
        if (newUnit) {
          addCreatedUnit(newUnit);
        }
      });
    });
    
    toast({
      title: "Success",
      description: "Units created successfully for all rooms",
      variant: "default"
    });
    
    nextStep();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Step 4: Create Units</h2>
        <p className="text-muted-foreground">Create units for each room</p>
      </div>
      
      <div className="space-y-4">
        {createdRooms.map((room, roomIndex) => (
          <Collapsible key={room.id} defaultOpen={roomIndex === 0}>
            <Card className="border border-gray-200">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-4 cursor-pointer">
                  <h3 className="text-lg font-medium">Room: {room.name}</h3>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4">
                  {unitsByRoom[room.id]?.map((unit, unitIndex) => (
                    <Card key={unitIndex} className="border border-gray-200">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Unit #{unitIndex + 1}</h4>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeUnitForm(room.id, unitIndex)}
                            className="text-red-500"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`name-${room.id}-${unitIndex}`}>
                              Unit Name
                            </Label>
                            <Input 
                              id={`name-${room.id}-${unitIndex}`}
                              name="name"
                              placeholder="Enter unit name"
                              value={unit.name}
                              onChange={(e) => handleInputChange(room.id, unitIndex, e)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`number-${room.id}-${unitIndex}`}>
                              Unit Number <span className="text-red-500">*</span>
                            </Label>
                            <Input 
                              id={`number-${room.id}-${unitIndex}`}
                              name="number"
                              placeholder="Enter unit number"
                              value={unit.number}
                              onChange={(e) => handleInputChange(room.id, unitIndex, e)}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`size-${room.id}-${unitIndex}`}>Size</Label>
                            <div className="flex gap-2">
                              <Input 
                                id={`size-${room.id}-${unitIndex}`}
                                name="size"
                                type="number"
                                placeholder="Size"
                                value={unit.size.toString()}
                                onChange={(e) => handleInputChange(room.id, unitIndex, e)}
                                className="flex-1"
                              />
                              <Select
                                value={unit.sizeUnit}
                                onValueChange={(value) => handleSelectChange(room.id, unitIndex, 'sizeUnit', value)}
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
                            <Label htmlFor={`status-${room.id}-${unitIndex}`}>Status</Label>
                            <Select
                              value={unit.status}
                              onValueChange={(value) => handleSelectChange(room.id, unitIndex, 'status', value)}
                            >
                              <SelectTrigger id={`status-${room.id}-${unitIndex}`}>
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
                            <Label htmlFor={`description-${room.id}-${unitIndex}`}>Description</Label>
                            <Textarea 
                              id={`description-${room.id}-${unitIndex}`}
                              name="description"
                              placeholder="Unit description (optional)"
                              value={unit.description}
                              onChange={(e) => handleInputChange(room.id, unitIndex, e)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button
                    variant="outline"
                    onClick={() => addUnitForm(room.id)}
                    className="w-full gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Another Unit to {room.name}
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
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
