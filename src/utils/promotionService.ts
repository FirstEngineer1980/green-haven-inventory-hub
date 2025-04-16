
import axios from 'axios';

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  startDate: string;
  endDate: string;
  categories: string[];
  active: boolean;
  image: string;
}

export interface PromotedProduct {
  product: any;
  original_price: number;
  discounted_price: number;
  discount_percentage: number;
  promotion: Promotion;
}

const API_URL = '/api';

export const fetchAllPromotions = async (): Promise<Promotion[]> => {
  const response = await axios.get(`${API_URL}/promotions`);
  return response.data;
};

export const fetchActivePromotions = async (): Promise<Promotion[]> => {
  const response = await axios.get(`${API_URL}/active-promotions`);
  return response.data;
};

export const fetchPublicPromotions = async (): Promise<Promotion[]> => {
  const response = await axios.get(`${API_URL}/public/promotions`);
  return response.data;
};

export const fetchPromotedProducts = async (): Promise<PromotedProduct[]> => {
  const response = await axios.get(`${API_URL}/promoted-products`);
  return response.data;
};

export const fetchPublicPromotedProducts = async (): Promise<PromotedProduct[]> => {
  const response = await axios.get(`${API_URL}/public/promoted-products`);
  return response.data;
};

export const createPromotion = async (promotion: Omit<Promotion, 'id'>): Promise<Promotion> => {
  const response = await axios.post(`${API_URL}/promotions`, promotion);
  return response.data;
};

export const updatePromotion = async (id: string, promotion: Partial<Promotion>): Promise<Promotion> => {
  const response = await axios.put(`${API_URL}/promotions/${id}`, promotion);
  return response.data;
};

export const deletePromotion = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/promotions/${id}`);
};

export const togglePromotionActive = async (id: string): Promise<Promotion> => {
  const response = await axios.patch(`${API_URL}/promotions/${id}/toggle-active`);
  return response.data;
};
