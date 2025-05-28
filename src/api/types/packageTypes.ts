
export interface Price {
  id: number;
  period: 'monthly' | 'yearly';
  old_price: number;
  price: number;
}

export interface Feature {
  id: number;
  title: string;
  supported: boolean;
}

export interface Package {
  id: number;
  name: string;
  prices: Price[];
  features: Feature[];
}

export interface PackagesResponse {
  message: string;
  data: {
    content: Package[];
  };
}
