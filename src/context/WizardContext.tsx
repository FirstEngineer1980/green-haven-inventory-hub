
import React, { createContext, useContext, useState } from 'react';
import { Customer, Room, Unit } from '../types';
import { useCustomers } from './CustomerContext';
import { useRooms } from './RoomContext';
import { useUnits } from './UnitContext';

type WizardStep = 'client' | 'list' | 'room' | 'unit' | 'skuMatrix' | 'complete';

interface WizardContextType {
  currentStep: WizardStep;
  goToStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  selectedCustomer: Customer | null;
  selectedRoom: Room | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  setSelectedRoom: (room: Room | null) => void;
  createdUnits: Unit[];
  addCreatedUnit: (unit: Unit) => void;
  resetWizard: () => void;
  isComplete: boolean;
}

const WizardContext = createContext<WizardContextType>({} as WizardContextType);

export const useWizard = () => useContext(WizardContext);

const stepOrder: WizardStep[] = ['client', 'list', 'room', 'unit', 'skuMatrix', 'complete'];

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('client');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [createdUnits, setCreatedUnits] = useState<Unit[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const goToStep = (step: WizardStep) => {
    setCurrentStep(step);
    if (step === 'complete') {
      setIsComplete(true);
    }
  };

  const nextStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
      if (currentIndex + 1 === stepOrder.length - 1) {
        setIsComplete(true);
      }
    }
  };

  const prevStep = () => {
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const addCreatedUnit = (unit: Unit) => {
    setCreatedUnits(prev => [...prev, unit]);
  };

  const resetWizard = () => {
    setCurrentStep('client');
    setSelectedCustomer(null);
    setSelectedRoom(null);
    setCreatedUnits([]);
    setIsComplete(false);
  };

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        goToStep,
        nextStep,
        prevStep,
        selectedCustomer,
        selectedRoom,
        setSelectedCustomer,
        setSelectedRoom,
        createdUnits,
        addCreatedUnit,
        resetWizard,
        isComplete
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};
