
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
      const token = localStorage.getItem('token');
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
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
  // Login function - now updated for Passport
  login: async (credentials) => {
    try {
      // First get CSRF cookie
      await api.get('/csrf-cookie');

      // Then attempt login with OAuth password grant
      const response = await api.post('/oauth/token', {
        grant_type: 'password',
        client_id: process.env.VITE_CLIENT_ID || '2',
        client_secret: process.env.VITE_CLIENT_SECRET || '',
        username: credentials.email,
        password: credentials.password,
        scope: '',
      });
      
      // Store the access token
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
      }
      
      // Get user data
      const userResponse = await api.get('/user');
      
      return {
        data: {
          token: response.data.access_token,
          user: userResponse.data
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Logout function
  logout: async () => {
    try {
      const response = await api.post('/logout');
      localStorage.removeItem('token');
      return response.data;
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/user');
      return {
        data: response.data
      };
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  },

  // Register function
  register: async (userData) => {
    try {
      const response = await api.post('/register', userData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return {
        data: {
          token: response.data.token,
          user: response.data.user
        }
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
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

// Promotion endpoints
export const promotionAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/promotions');
      return response;
    } catch (error) {
      console.error('Error fetching promotions:', error);
      throw error;
    }
  },

  getActive: async () => {
    try {
      const response = await api.get('/active-promotions');
      return response;
    } catch (error) {
      console.error('Error fetching active promotions:', error);
      throw error;
    }
  },

  getDiscountedProducts: async () => {
    try {
      const response = await api.get('/discounted-products');
      return response;
    } catch (error) {
      console.error('Error fetching discounted products:', error);
      throw error;
    }
  },

  getOne: async (id: string) => {
    try {
      const response = await api.get(`/promotions/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching promotion ${id}:`, error);
      throw error;
    }
  },

  create: async (promotionData: any) => {
    try {
      const response = await api.post('/promotions', promotionData);
      return response;
    } catch (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }
  },

  update: async (id: string, promotionData: any) => {
    try {
      const response = await api.put(`/promotions/${id}`, promotionData);
      return response;
    } catch (error) {
      console.error(`Error updating promotion ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/promotions/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting promotion ${id}:`, error);
      throw error;
    }
  },
};

// Customer Product endpoints
export const customerProductAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/customer-products');
      return response;
    } catch (error) {
      console.error('Error fetching customer products:', error);
      throw error;
    }
  },

  getByCustomer: async (customerId: string) => {
    try {
      const response = await api.get(`/customers/${customerId}/products`);
      return response;
    } catch (error) {
      console.error(`Error fetching products for customer ${customerId}:`, error);
      throw error;
    }
  },

  getOne: async (id: string) => {
    try {
      const response = await api.get(`/customer-products/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching customer product ${id}:`, error);
      throw error;
    }
  },

  create: async (productData: any) => {
    try {
      const response = await api.post('/customer-products', productData);
      return response;
    } catch (error) {
      console.error('Error creating customer product:', error);
      throw error;
    }
  },

  update: async (id: string, productData: any) => {
    try {
      const response = await api.put(`/customer-products/${id}`, productData);
      return response;
    } catch (error) {
      console.error(`Error updating customer product ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/customer-products/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting customer product ${id}:`, error);
      throw error;
    }
  },
};

// Customer List endpoints
export const customerListAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/customer-lists');
      return response;
    } catch (error) {
      console.error('Error fetching customer lists:', error);
      throw error;
    }
  },

  getByCustomer: async (customerId: string) => {
    try {
      const response = await api.get(`/customers/${customerId}/lists`);
      return response;
    } catch (error) {
      console.error(`Error fetching lists for customer ${customerId}:`, error);
      throw error;
    }
  },

  getOne: async (id: string) => {
    try {
      const response = await api.get(`/customer-lists/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching customer list ${id}:`, error);
      throw error;
    }
  },

  create: async (listData: any) => {
    try {
      const response = await api.post('/customer-lists', listData);
      return response;
    } catch (error) {
      console.error('Error creating customer list:', error);
      throw error;
    }
  },

  update: async (id: string, listData: any) => {
    try {
      const response = await api.put(`/customer-lists/${id}`, listData);
      return response;
    } catch (error) {
      console.error(`Error updating customer list ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete(`/customer-lists/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting customer list ${id}:`, error);
      throw error;
    }
  },
};

// Default export with all API services
export default {
  auth: authAPI,
  products: productAPI,
  categories: categoryAPI,
  promotions: promotionAPI,
  customerProducts: customerProductAPI,
  customerLists: customerListAPI,
};
