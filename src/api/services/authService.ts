import { apiInstance } from './api';
import { User, AuthResponse } from '../types/authTypes';

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await apiInstance.post('/login', { email, password });
    
    // Store the token in localStorage for Passport
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (name: string, email: string, password: string, passwordConfirmation: string): Promise<AuthResponse> => {
  try {
    const response = await apiInstance.post('/register', { 
      name, 
      email, 
      password, 
      password_confirmation: passwordConfirmation 
    });
    
    // Store the token in localStorage for Passport
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    await apiInstance.post('/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local storage on logout
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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

export const checkAuthStatus = async (): Promise<User | null> => {
  try {
    const response = await apiInstance.get('/user');
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getCsrfCookie = async (): Promise<void> => {
  // Not needed for Passport, but keeping for compatibility
  return Promise.resolve();
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  getUsers,
  checkAuthStatus,
  getCsrfCookie,
  getAuthHeaders,
};
