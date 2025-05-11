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
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
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
                                          <RouterProvider router={router} />
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
