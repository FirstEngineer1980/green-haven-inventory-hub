
import React from 'react';
import { WizardProvider } from '@/context/WizardContext';
import Wizard from '@/components/wizard/Wizard';

const WizardPage = () => {
  return (
    <WizardProvider>
      <Wizard />
    </WizardProvider>
  );
};

export default WizardPage;
