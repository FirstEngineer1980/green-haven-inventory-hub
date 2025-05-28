
import { apiInstance } from './api';
import { User, AuthResponse } from '../types/authTypes';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await apiInstance.post('/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiInstance.post('/logout');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await apiInstance.get('/user');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiInstance.get('/users');
    return response.data;
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

export const authService = {
  login,
  logout,
  getCurrentUser,
  getUsers,
};
