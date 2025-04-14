
import React from 'react';
import { useWizard } from '@/context/WizardContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, UserPlus, ListPlus, DoorOpen, SquarePlus, Table } from 'lucide-react';
import ClientStep from './steps/ClientStep';
import ListStep from './steps/ListStep';
import RoomStep from './steps/RoomStep';
import UnitStep from './steps/UnitStep';
import SkuMatrixStep from './steps/SkuMatrixStep';
import CompletionStep from './steps/CompletionStep';

const Wizard = () => {
  const { currentStep } = useWizard();

  // Map steps to components
  const renderStepContent = () => {
    switch (currentStep) {
      case 'client':
        return <ClientStep />;
      case 'list':
        return <ListStep />;
      case 'room':
        return <RoomStep />;
      case 'unit':
        return <UnitStep />;
      case 'skuMatrix':
        return <SkuMatrixStep />;
      case 'complete':
        return <CompletionStep />;
      default:
        return <ClientStep />;
    }
  };

  // Helper function to determine if a step is completed or active
  const getStepState = (step: string) => {
    const stepIndex = ['client', 'list', 'room', 'unit', 'skuMatrix', 'complete'].indexOf(step);
    const currentIndex = ['client', 'list', 'room', 'unit', 'skuMatrix', 'complete'].indexOf(currentStep);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'upcoming';
  };

  return (
    <DashboardLayout>
      <div className="container py-6">
        <Card>
          <CardHeader>
            <CardTitle>Setup Wizard</CardTitle>
            <CardDescription>
              Complete each step to set up your inventory management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <Tabs 
                value={currentStep} 
                className="w-full"
              >
                <TabsList className="grid grid-cols-5 mb-8">
                  <TabsTrigger 
                    value="client" 
                    className="flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    disabled
                  >
                    {getStepState('client') === 'completed' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                    Client
                  </TabsTrigger>
                  <TabsTrigger 
                    value="list" 
                    className="flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    disabled
                  >
                    {getStepState('list') === 'completed' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <ListPlus className="h-4 w-4" />
                    )}
                    List
                  </TabsTrigger>
                  <TabsTrigger 
                    value="room" 
                    className="flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    disabled
                  >
                    {getStepState('room') === 'completed' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <DoorOpen className="h-4 w-4" />
                    )}
                    Room
                  </TabsTrigger>
                  <TabsTrigger 
                    value="unit" 
                    className="flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    disabled
                  >
                    {getStepState('unit') === 'completed' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <SquarePlus className="h-4 w-4" />
                    )}
                    Units
                  </TabsTrigger>
                  <TabsTrigger 
                    value="skuMatrix" 
                    className="flex gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    disabled
                  >
                    {getStepState('skuMatrix') === 'completed' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Table className="h-4 w-4" />
                    )}
                    SKU Matrix
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={currentStep} className="mt-4">
                  {renderStepContent()}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Wizard;
