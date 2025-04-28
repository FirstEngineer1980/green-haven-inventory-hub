import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api',
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
};

// Product endpoints
export const productAPI = {
  getProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProduct: async (id: number) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  createProduct: async (productData: any) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (id: number, productData: any) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  deleteProduct: async (id: number) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
};

export default api;
