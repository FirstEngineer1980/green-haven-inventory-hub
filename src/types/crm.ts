
export interface Seller {
  id: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  status: 'active' | 'inactive';
  commission_rate: number;
  leader_id?: string;
  leader?: {
    id: string;
    name: string;
    email: string;
  };
  clients?: Client[];
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  status: 'active' | 'inactive' | 'prospect';
  notes?: string;
  seller_id?: string;
  seller?: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CRMStats {
  totalSellers: number;
  totalClients: number;
  activeClients: number;
  prospectClients: number;
}
