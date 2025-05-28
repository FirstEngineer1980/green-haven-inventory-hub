import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // Important for cookies/CSRF/authentication
});

// Request interceptor to add token to headers
api.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
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

// Auth service with CSRF handling
export const authService = {
  login: async (email: string, password: string) => {
    try {
      console.log('Fetching CSRF token from:', 'http://127.0.0.1:8000/sanctum/csrf-cookie');
      const csrfResponse = await api.get('/sanctum/csrf-cookie');
      console.log('CSRF cookie response:', csrfResponse.status);
      const response = await api.post('/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (email: string, name: string, password: string, password_confirmation: string) => {
    try {
      await api.get('/sanctum/csrf-cookie');
      const response = await api.post('/register', { email, name, password, password_confirmation });
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
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

  getCurrentUser: async () => {
    try {
      const response = await api.get('/user/current');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  updateProfile: async (userData: any) => {
    try {
      const response = await api.put('/user/profile', userData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
};

// Product service
export const productService = {
  getProducts: async () => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProduct: async (id: string) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  addProduct: async (product: any) => {
    try {
      const response = await api.post('/products', product);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  updateProduct: async (id: string, product: any) => {
    try {
      const response = await api.put(`/products/${id}`, product);
      return response.data;
    } catch (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
  },
};

// Category service
export const categoryService = {
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  getCategory: async (id: string) => {
    try {
      const response = await api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  addCategory: async (category: any) => {
    try {
      const response = await api.post('/categories', category);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  updateCategory: async (id: string, category: any) => {
    try {
      const response = await api.put(`/categories/${id}`, category);
      return response.data;
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },

  deleteCategory: async (id: string) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },
};

// Customer service
export const customerService = {
  getCustomers: async () => {
    try {
      const response = await api.get('/customers');
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getCustomer: async (id: string) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  },

  addCustomer: async (customer: any) => {
    try {
      const response = await api.post('/customers', customer);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  updateCustomer: async (id: string, customer: any) => {
    try {
      const response = await api.put(`/customers/${id}`, customer);
      return response.data;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw error;
    }
  },

  deleteCustomer: async (id: string) => {
    try {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting customer ${id}:`, error);
      throw error;
    }
  },
};

// Promotion service
export const promotionService = {
  getPromotions: async () => {
    try {
      const response = await api.get('/promotions');
      return response.data;
    } catch (error) {
      console.error('Error fetching promotions:', error);
      throw error;
    }
  },

  getPromotion: async (id: string) => {
    try {
      const response = await api.get(`/promotions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching promotion ${id}:`, error);
      throw error;
    }
  },

  addPromotion: async (promotion: any) => {
    try {
      const response = await api.post('/promotions', promotion);
      return response.data;
    } catch (error) {
      console.error('Error creating promotion:', error);
      throw error;
    }
  },

  updatePromotion: async (id: string, promotion: any) => {
    try {
      const response = await api.put(`/promotions/${id}`, promotion);
      return response.data;
    } catch (error) {
      console.error(`Error updating promotion ${id}:`, error);
      throw error;
    }
  },

  deletePromotion: async (id: string) => {
    try {
      const response = await api.delete(`/promotions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting promotion ${id}:`, error);
      throw error;
    }
  },
};

// Combining all services for easier import
export const apiServices = {
  auth: authService,
  products: productService,
  categories: categoryService,
  customers: customerService,
  promotions: promotionService,
};

export default apiServices;