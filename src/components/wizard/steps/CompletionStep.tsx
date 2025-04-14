
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizard } from '@/context/WizardContext';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Home, ArrowRight } from 'lucide-react';

const CompletionStep = () => {
  const { selectedCustomer, selectedRoom, createdUnits, resetWizard } = useWizard();
  const navigate = useNavigate();
  
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };
  
  const handleStartOver = () => {
    resetWizard();
  };
  
  return (
    <div className="space-y-8 text-center py-6">
      <div className="flex justify-center">
        <CheckCircle2 className="h-16 w-16 text-primary" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2">Setup Complete!</h2>
        <p className="text-muted-foreground">
          You have successfully set up your inventory management system.
        </p>
      </div>
      
      <div className="bg-muted p-6 rounded-lg max-w-xl mx-auto">
        <h3 className="font-medium mb-4">Summary</h3>
        <div className="space-y-2 text-left">
          <p>
            <span className="font-medium">Client:</span> {selectedCustomer?.name}
          </p>
          <p>
            <span className="font-medium">Room:</span> {selectedRoom?.name}
          </p>
          <p>
            <span className="font-medium">Units:</span> {createdUnits.length} created
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            You can now manage these items from their respective sections in the dashboard.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
        <Button 
          variant="outline" 
          onClick={handleStartOver}
          className="gap-2"
        >
          Start New Setup
        </Button>
        <Button 
          onClick={handleGoToDashboard}
          className="gap-2"
        >
          <Home className="h-4 w-4" />
          Go to Dashboard
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default CompletionStep;
