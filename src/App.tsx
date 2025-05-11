
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { NotificationProvider } from './context/NotificationContext';
import { UserProvider } from './context/UserContext';
import { CustomerProvider } from './context/CustomerContext';
import { RoomProvider } from './context/RoomContext';
import { UnitProvider } from './context/UnitContext';
import { CustomerProductProvider } from './context/CustomerProductContext';
import { BinProvider } from './context/BinContext';
import { UnitMatrixProvider } from './context/UnitMatrixContext';
import { POProvider } from './context/POContext';
import { WizardProvider } from './context/WizardContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ComparisonProvider } from './context/ComparisonContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CategoryProvider } from './context/CategoryContext';
import { PromotionProvider } from './context/PromotionContext';

// Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Customers from './pages/Customers';
import CustomerProducts from './pages/CustomerProducts';
import CustomerList from './pages/CustomerList';
import Rooms from './pages/Rooms';
import Units from './pages/Units';
import PurchaseOrders from './pages/PurchaseOrders';
import Vendors from './pages/Vendors';
import StockMovements from './pages/StockMovements';
import Bins from './pages/Bins';
import UnitMatrixPage from './pages/UnitMatrixPage';
import Users from './pages/Users';
import ManageCustomer from './pages/ManageCustomer';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import WizardPage from './pages/WizardPage';
import Inventory from './pages/Inventory';
import Unauthorized from './pages/Unauthorized';
import Index from './pages/Index';
import Profile from './pages/Profile';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LandingPage from './pages/LandingPage';
import ProductsPage from './pages/ProductsPage';
import ProductPage from './pages/ProductPage';
import FavoritesPage from './pages/FavoritesPage';
import ComparePage from './pages/ComparePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PromotionsPage from './pages/PromotionsPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

import ProtectedRoute from './components/auth/ProtectedRoute';

import './App.css';

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster />
          <NotificationProvider>
            <CustomerProvider>
              <ProductProvider>
                <CategoryProvider>
                  <UnitProvider>
                    <RoomProvider>
                      <BinProvider>
                        <UnitMatrixProvider>
                          <POProvider>
                            <UserProvider>
                              <CartProvider>
                                <FavoritesProvider>
                                  <ComparisonProvider>
                                    <CustomerProductProvider>
                                      <WizardProvider>
                                        <PromotionProvider>
                                          <BrowserRouter>
                                            <Routes>
                                              {/* Public routes */}
                                              <Route path="/login" element={<Login />} />
                                              <Route path="/unauthorized" element={<Unauthorized />} />
                                              <Route path="/" element={<Index />} />
                                              <Route path="/about" element={<AboutPage />} />
                                              <Route path="/contact" element={<ContactPage />} />
                                              <Route path="/landing" element={<LandingPage />} />
                                              <Route path="/products-page" element={<ProductsPage />} />
                                              <Route path="/product/:id" element={<ProductPage />} />
                                              <Route path="/favorites" element={<FavoritesPage />} />
                                              <Route path="/compare" element={<ComparePage />} />
                                              <Route path="/cart" element={<CartPage />} />
                                              <Route path="/checkout" element={<CheckoutPage />} />
                                              <Route path="/promotions" element={<PromotionsPage />} />
                                              <Route path="/orders" element={<OrdersPage />} />
                                              <Route path="/order/:id" element={<OrderDetailsPage />} />
                                              <Route path="/order-success" element={<OrderSuccessPage />} />

                                              {/* Protected routes */}
                                              <Route 
                                                path="/dashboard" 
                                                element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/products" 
                                                element={<ProtectedRoute><Products /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/categories" 
                                                element={<ProtectedRoute><Categories /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/customers" 
                                                element={<ProtectedRoute><Customers /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/customers/manage/:id?" 
                                                element={<ProtectedRoute><ManageCustomer /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/customer-products" 
                                                element={<ProtectedRoute><CustomerProducts /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/customer-list/:id?" 
                                                element={<ProtectedRoute><CustomerList /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/rooms" 
                                                element={<ProtectedRoute><Rooms /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/units" 
                                                element={<ProtectedRoute><Units /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/purchase-orders" 
                                                element={<ProtectedRoute><PurchaseOrders /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/vendors" 
                                                element={<ProtectedRoute><Vendors /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/stock-movements" 
                                                element={<ProtectedRoute><StockMovements /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/bins" 
                                                element={<ProtectedRoute><Bins /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/unit-matrix" 
                                                element={<ProtectedRoute><UnitMatrixPage /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/users" 
                                                element={<ProtectedRoute><Users /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/notifications" 
                                                element={<ProtectedRoute><Notifications /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/settings" 
                                                element={<ProtectedRoute><Settings /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/reports" 
                                                element={<ProtectedRoute><Reports /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/wizard" 
                                                element={<ProtectedRoute><WizardPage /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/inventory" 
                                                element={<ProtectedRoute><Inventory /></ProtectedRoute>} 
                                              />
                                              <Route 
                                                path="/profile" 
                                                element={<ProtectedRoute><Profile /></ProtectedRoute>} 
                                              />

                                              {/* Catch all */}
                                              <Route path="*" element={<NotFound />} />
                                            </Routes>
                                          </BrowserRouter>
                                        </PromotionProvider>
                                      </WizardProvider>
                                    </CustomerProductProvider>
                                  </ComparisonProvider>
                                </FavoritesProvider>
                              </CartProvider>
                            </UserProvider>
                          </POProvider>
                        </UnitMatrixProvider>
                      </BinProvider>
                    </RoomProvider>
                  </UnitProvider>
                </CategoryProvider>
              </ProductProvider>
            </CustomerProvider>
          </NotificationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
