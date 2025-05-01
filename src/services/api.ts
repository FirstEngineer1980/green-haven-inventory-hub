
import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'https://backend.myphr.io/backend/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for cookies/CSRF/authentication
});

// Request interceptor for API calls
api.interceptors.request.use(
    async (config) => {
      // You can add logic here to attach tokens if needed
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

// Response interceptor for API calls
api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 errors
      if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        console.error('API Error: 401', error.message);

        // Redirect to login page for authentication errors
        console.log('Redirecting to login page due to 401 error');
        window.location.href = '/login';

        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
);

// Authentication endpoints
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      // First get CSRF cookie
      await api.get('/csrf-cookie');

      // Then attempt login
      const response = await api.post('/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/logout');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getUser: async () => {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  // Adding the missing register method
  register: async (userData: { name: string, email: string, password: string, password_confirmation: string }) => {
    try {
      // First get CSRF cookie
      await api.get('/csrf-cookie');

      // Then attempt registration
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Alias for getUser to match the code in AuthContext and AuthProvider
  getCurrentUser: async () => {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },
};

// Product endpoints
export const productAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/products');
      return response;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getOne: async (id: string) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  create: async (productData: any) => {
    try {
      const response = await api.post('/products', productData);
      return response;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  update: async (id: string, productData: any) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
};

// Category endpoints
export const categoryAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/categories');
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  getOne: async (id: string) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  create: async (categoryData: any) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  update: async (id: string, categoryData: any) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },
};

// Default export with all API services
export default {
  auth: authAPI,
  products: productAPI,
  categories: categoryAPI,
};
