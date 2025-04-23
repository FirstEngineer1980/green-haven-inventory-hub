
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Product, StockMovement, Category } from '../types';
import { useNotifications } from './NotificationContext';
import api from '../services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';

interface ProductContextType {
  products: Product[];
  stockMovements: StockMovement[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'date'>) => void;
  getLowStockProducts: () => Product[];
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType>({} as ProductContextType);

export const useProducts = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Only fetch data if authenticated
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch products
        const productsResponse = await api.products.getAll();
        console.log("Products API response:", productsResponse);
        
        if (productsResponse?.data) {
          const normalizedProducts = productsResponse.data.map(product => ({
            ...product,
            price: typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price),
            costPrice: typeof product.costPrice === 'string' ? parseFloat(product.costPrice) : Number(product.costPrice),
            quantity: typeof product.quantity === 'string' ? parseInt(product.quantity, 10) : Number(product.quantity),
            threshold: typeof product.threshold === 'string' ? parseInt(product.threshold, 10) : Number(product.threshold),
          }));
          setProducts(normalizedProducts);
        }
        
        // Fetch categories
        const categoriesResponse = await api.categories.getAll();
        console.log("Categories API response:", categoriesResponse);
        
        if (categoriesResponse?.data) {
          setCategories(categoriesResponse.data);
        }
      } catch (err: any) {
        console.error('Error fetching product data:', err);
        setError(err.response?.data?.message || 'Failed to fetch products. Please try again.');
        
        toast({
          title: "Error loading product data",
          description: err.response?.data?.message || 'Failed to load products and categories',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, toast]);

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await api.products.create(product);
      console.log("Created product response:", res);
      
      const newProduct = {
        ...res.data,
        price: typeof res.data.price === 'string' ? parseFloat(res.data.price) : Number(res.data.price),
        costPrice: typeof res.data.costPrice === 'string' ? parseFloat(res.data.costPrice) : Number(res.data.costPrice),
        quantity: typeof res.data.quantity === 'string' ? parseInt(res.data.quantity, 10) : Number(res.data.quantity),
        threshold: typeof res.data.threshold === 'string' ? parseInt(res.data.threshold, 10) : Number(res.data.threshold),
      };
      
      setProducts((prev) => [...prev, newProduct]);
      addNotification({
        title: 'New Product Added',
        message: `${newProduct.name} has been added to inventory`,
        type: 'info',
        for: ['1', '2', '3', '4'],
      });
      
      toast({
        title: "Product added",
        description: `${newProduct.name} has been added to the inventory`,
      });
    } catch (error: any) {
      console.error('Error adding product:', error);
      
      toast({
        title: "Failed to add product",
        description: error.response?.data?.message || "An error occurred while adding the product",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const res = await api.products.update(id, updates);
    const updatedProduct = {
      ...res.data,
      price: typeof res.data.price === 'string' ? parseFloat(res.data.price) : Number(res.data.price),
      costPrice: typeof res.data.costPrice === 'string' ? parseFloat(res.data.costPrice) : Number(res.data.costPrice),
      quantity: typeof res.data.quantity === 'string' ? parseInt(res.data.quantity, 10) : Number(res.data.quantity),
      threshold: typeof res.data.threshold === 'string' ? parseInt(res.data.threshold, 10) : Number(res.data.threshold),
    };
    
    setProducts(prev => 
      prev.map(product => 
        product.id == id 
          ? { ...product, ...updatedProduct }
          : product
      )
    );
    addNotification({
      title: 'Inventory Updated',
      message: `${updatedProduct.name} inventory has been updated`,
      type: 'success',
      for: ['1', '2', '3'],
    });
    if ((updatedProduct.quantity !== undefined) && (updatedProduct.quantity <= (updatedProduct.threshold))) {
      addNotification({
        title: 'Low Stock Alert',
        message: `${updatedProduct.name} is below the threshold quantity`,
        type: 'warning',
        for: ['1', '2'],
      });
    }
  };

  const deleteProduct = async (id: string) => {
    const prod = products.find(p => p.id == id);
    await api.products.delete(id);
    setProducts(prev => prev.filter(product => product.id != id));
    if (prod) {
      addNotification({
        title: 'Product Deleted',
        message: `${prod.name} has been removed from inventory`,
        type: 'info',
        for: ['1', '2'],
      });
    }
  };

  const addCategory = async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await api.categories.create(category);
    setCategories(prev => [...prev, res.data]);
    addNotification({
      title: 'New Category Added',
      message: `${res.data.name} category has been added`,
      type: 'info',
      for: ['1', '2'],
    });
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const res = await api.categories.update(id, updates);
    setCategories(prev => 
      prev.map(category => 
        category.id == id 
          ? { ...category, ...res.data }
          : category
      )
    );
    addNotification({
      title: 'Category Updated',
      message: `${res.data.name} category has been updated`,
      type: 'info',
      for: ['1', '2'],
    });
  };

  const deleteCategory = async (id: string) => {
    const cat = categories.find(c => c.id == id);
    await api.categories.delete(id);
    setCategories(prev => prev.filter(category => category.id != id));
    if (cat) {
      addNotification({
        title: 'Category Deleted',
        message: `${cat.name} category has been removed`,
        type: 'info',
        for: ['1', '2'],
      });
    }
  };

  const addStockMovement = (movement: Omit<StockMovement, 'id' | 'date'>) => {
    const newMovement: StockMovement = {
      ...movement,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    setStockMovements(prev => [newMovement, ...prev]);
    
    const product = products.find(p => p.id === movement.productId);
    if (product) {
      const newQuantity = movement.type === 'in' 
        ? product.quantity + movement.quantity
        : product.quantity - movement.quantity;
        
      updateProduct(movement.productId, { quantity: newQuantity });
    }
  };

  const getLowStockProducts = (): Product[] => {
    return products.filter(product => product.quantity <= product.threshold);
  };

  return (
    <ProductContext.Provider value={{
      products,
      stockMovements,
      categories,
      isLoading,
      error,
      addProduct,
      updateProduct,
      deleteProduct,
      addStockMovement,
      getLowStockProducts,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </ProductContext.Provider>
  );
};
