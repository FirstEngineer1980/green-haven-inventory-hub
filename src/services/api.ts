
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Extend AxiosInstance with our custom properties
interface ExtendedAxiosInstance extends axios.AxiosInstance {
  products: {
    getAll: () => Promise<any>;
    getOne: (id: string) => Promise<any>;
    create: (product: any) => Promise<any>;
    update: (id: string, product: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
  categories: {
    getAll: () => Promise<any>;
    getOne: (id: string) => Promise<any>;
    create: (category: any) => Promise<any>;
    update: (id: string, category: any) => Promise<any>;
    delete: (id: string) => Promise<any>;
  };
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}) as ExtendedAxiosInstance;

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authService = {
  login: (email: string, password: string) => 
    api.post('/login', { email, password }),
  
  register: (userData: any) => 
    api.post('/register', userData),
  
  logout: () => 
    api.post('/logout'),
  
  getUser: () => 
    api.get('/user'),
    
  getCurrentUser: () => 
    api.get('/user/current'),
  
  updateProfile: (userData: any) => 
    api.put('/user/profile', userData),
};

// Product APIs
export const productService = {
  getProducts: () => 
    api.get('/products'),
  
  getProduct: (id: string) => 
    api.get(`/products/${id}`),
  
  addProduct: (product: any) => 
    api.post('/products', product),
  
  updateProduct: (id: string, product: any) => 
    api.put(`/products/${id}`, product),
  
  deleteProduct: (id: string) => 
    api.delete(`/products/${id}`),
};

// Category APIs
export const categoryService = {
  getCategories: () => 
    api.get('/categories'),
  
  getCategory: (id: string) => 
    api.get(`/categories/${id}`),
  
  addCategory: (category: any) => 
    api.post('/categories', category),
  
  updateCategory: (id: string, category: any) => 
    api.put(`/categories/${id}`, category),
  
  deleteCategory: (id: string) => 
    api.delete(`/categories/${id}`),
};

// Customer APIs
export const customerService = {
  getCustomers: () => 
    api.get('/customers'),
  
  getCustomer: (id: string) => 
    api.get(`/customers/${id}`),
  
  addCustomer: (customer: any) => 
    api.post('/customers', customer),
  
  updateCustomer: (id: string, customer: any) => 
    api.put(`/customers/${id}`, customer),
  
  deleteCustomer: (id: string) => 
    api.delete(`/customers/${id}`),
};

// Promotion APIs
export const promotionService = {
  getPromotions: () => 
    api.get('/promotions'),
  
  getPromotion: (id: string) => 
    api.get(`/promotions/${id}`),
  
  addPromotion: (promotion: any) => 
    api.post('/promotions', promotion),
  
  updatePromotion: (id: string, promotion: any) => 
    api.put(`/promotions/${id}`, promotion),
  
  deletePromotion: (id: string) => 
    api.delete(`/promotions/${id}`),
};

// Export authAPI for backward compatibility
export const authAPI = authService;

// Namespace for API products
api.products = {
  getAll: productService.getProducts,
  getOne: productService.getProduct,
  create: productService.addProduct,
  update: productService.updateProduct,
  delete: productService.deleteProduct
};

// Namespace for API categories
api.categories = {
  getAll: categoryService.getCategories,
  getOne: categoryService.getCategory,
  create: categoryService.addCategory,
  update: categoryService.updateCategory,
  delete: categoryService.deleteCategory
};

// Combining all services for easier import
export const apiService = {
  ...authService,
  ...productService,
  ...categoryService,
  ...customerService,
  ...promotionService,
};

export default api;
