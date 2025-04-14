
import React, { useState } from 'react';
import { useWizard } from '@/context/WizardContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ListItem {
  id: string;
  name: string;
  sku: string;
  quantity: string;
  description: string;
  picture: string;
  notes: string;
}

const ListStep = () => {
  const { prevStep, nextStep, selectedCustomer } = useWizard();
  const { toast } = useToast();
  
  const [lists, setLists] = useState<ListItem[]>([]);
  const [currentList, setCurrentList] = useState<ListItem>({
    id: crypto.randomUUID(),
    name: '',
    sku: '',
    quantity: '',
    description: '',
    picture: '',
    notes: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentList(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddList = () => {
    // Validate required fields
    if (!currentList.name || !currentList.sku || !currentList.quantity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Add the current list to lists array
    setLists(prev => [...prev, currentList]);
    
    // Reset the form for a new list
    setCurrentList({
      id: crypto.randomUUID(),
      name: '',
      sku: '',
      quantity: '',
      description: '',
      picture: '',
      notes: ''
    });
    
    toast({
      title: "Success",
      description: `List "${currentList.name}" added for customer ${selectedCustomer?.name}`,
    });
  };
  
  const handleDeleteList = (id: string) => {
    setLists(prev => prev.filter(list => list.id !== id));
    toast({
      title: "List Deleted",
      description: "The list has been removed",
    });
  };
  
  const handleSaveAndContinue = () => {
    if (lists.length === 0 && !currentList.name) {
      toast({
        title: "No Lists",
        description: "Please add at least one list before continuing",
        variant: "destructive"
      });
      return;
    }
    
    // If there's an incomplete list, ask to add it first
    if (currentList.name || currentList.sku || currentList.quantity) {
      toast({
        title: "Unsaved List",
        description: "Please add or clear the current list before continuing",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would save all lists to the database here
    toast({
      title: "Success",
      description: `${lists.length} lists saved for customer ${selectedCustomer?.name}`,
    });
    
    nextStep();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Step 2: Create Lists</h2>
        <p className="text-muted-foreground">Create lists for customer {selectedCustomer?.name}</p>
      </div>
      
      {lists.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Added Lists</h3>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-4">
                {lists.map((list) => (
                  <div key={list.id} className="flex items-center justify-between p-2 rounded-lg border bg-muted/40">
                    <div>
                      <p className="font-medium">{list.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {list.sku} | Quantity: {list.quantity}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteList(list.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      
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
                  value={currentList.name} 
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
                  value={currentList.sku} 
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
                  value={currentList.quantity} 
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
                  value={currentList.picture} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Enter description (optional)" 
                  value={currentList.description} 
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
                  value={currentList.notes} 
                  onChange={handleInputChange} 
                  className="resize-none min-h-[100px]" 
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={prevStep}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="space-x-4">
          <Button
            onClick={handleAddList}
            variant="outline"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add List
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
    </div>
  );
};

export default ListStep;
