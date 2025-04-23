
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend.myphr.io/backend/api', // Updated to include /backend/api
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true // Enable sending cookies with requests
});

// Add request interceptor to include auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Track if we're already redirecting to prevent multiple redirects
let isRedirecting = false;

// Add response interceptor to handle common errors
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.status, error.message);
    
    // Handle authentication errors
    if (error.response) {
      if (error.response.status === 401 && !isRedirecting) {
        // Clear token if unauthorized
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        
        // Only redirect if not on login or register page already
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          isRedirecting = true;
          console.log('Redirecting to login page due to 401 error');
          window.location.href = '/login';
          setTimeout(() => {
            isRedirecting = false;
          }, 1000);
        }
      } else if (error.response.status === 403) {
        // Forbidden - user doesn't have permission
        console.error('Permission denied:', error.response.data.message);
      } else if (error.response.status === 500) {
        // Server error
        console.error('Server error:', error.response.data.message);
      }
    } else if (error.request) {
      // Request was made but no response
      console.error('Network error: No response received from server');
    } else {
      // Error in setting up request
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: (credentials: { email: string; password: string }) => 
    api.post('/login', credentials),
  
  register: (userData: { name: string; email: string; password: string; password_confirmation: string }) => 
    api.post('/register', userData),
    
  logout: () => api.post('/logout'),
  
  getCurrentUser: () => api.get('/user')
};

// Products API functions
export const productsAPI = {
  getAll: (params?: any) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
  getLowStock: () => api.get('/products/low-stock')
};

// Categories API functions
export const categoriesAPI = {
  getAll: (params?: any) => api.get('/categories', { params }),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`)
};

// Export all API services
export default {
  auth: authAPI,
  products: productsAPI,
  categories: categoriesAPI
};
