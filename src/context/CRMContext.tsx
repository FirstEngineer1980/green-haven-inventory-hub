import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Seller, Client } from '@/types/crm';
import { crmService } from '@/api/services/crmService';

interface CRMContextProps {
  sellers: Seller[];
  clients: Client[];
  loading: boolean;
  error: string | null;
  refetchSellers: () => void;
  refetchClients: () => void;
  stats: {
    totalSellers: number;
    totalClients: number;
    activeClients: number;
    prospectClients: number;
  };
}

const CRMContext = createContext<CRMContextProps | undefined>(undefined);

export const CRMProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);

  const { data: sellers = [], isLoading: sellersLoading, refetch: refetchSellers } = useQuery({
    queryKey: ['sellers'],
    queryFn: crmService.getSellers,
    enabled: false, // Only enable when explicitly needed
  });

  const { data: clients = [], isLoading: clientsLoading, refetch: refetchClients } = useQuery({
    queryKey: ['clients'],
    queryFn: crmService.getClients,
    enabled: false, // Only enable when explicitly needed
  });

  const stats = {
    totalSellers: sellers.length,
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'active').length,
    prospectClients: clients.filter(c => c.status === 'prospect').length,
  };

  const value: CRMContextProps = {
    sellers,
    clients,
    loading: sellersLoading || clientsLoading,
    error,
    refetchSellers,
    refetchClients,
    stats,
  };

  return (
    <CRMContext.Provider value={value}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = (): CRMContextProps => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};