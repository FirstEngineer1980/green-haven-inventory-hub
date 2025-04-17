
import axios from 'axios';

// Create a custom axios instance
const api = axios.create({
  baseURL: 'https://backend.myphr.io/backend/api',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
  response => response,
  error => {
    // Handle authentication errors
    if (error.response) {
      if (error.response.status === 401) {
        console.log("401 Unauthorized response received, clearing token");
        localStorage.removeItem('token');
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          console.log("Redirecting to login page");
          window.location.href = '/login';
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

// Customers API functions
export const customersAPI = {
  getAll: (params?: any) => api.get('/customers', { params }),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`)
};

// Purchase Orders API functions
export const purchaseOrdersAPI = {
  getAll: (params?: any) => api.get('/purchase-orders', { params }),
  getById: (id: string) => api.get(`/purchase-orders/${id}`),
  create: (data: any) => api.post('/purchase-orders', data),
  update: (id: string, data: any) => api.put(`/purchase-orders/${id}`, data),
  updateStatus: (id: string, status: string) => api.patch(`/purchase-orders/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/purchase-orders/${id}`)
};

// Export all API services
export default {
  auth: authAPI,
  products: productsAPI,
  customers: customersAPI,
  purchaseOrders: purchaseOrdersAPI
};
