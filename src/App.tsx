
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
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

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="inventory-theme">
      <AuthProvider>
        <NotificationProvider>
          <UserProvider>
            <CustomerProvider>
              <RoomProvider>
                <UnitProvider>
                  <CustomerProductProvider>
                    <ProductProvider>
                      <BinProvider>
                        <UnitMatrixProvider>
                          <POProvider>
                            <WizardProvider>
                              <FavoritesProvider>
                                <ComparisonProvider>
                                  <CartProvider>
                                    <BrowserRouter>
                                      <Routes>
                                        <Route path="/" element={<LandingPage />} />
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/unauthorized" element={<Unauthorized />} />
                                        <Route path="/about" element={<AboutPage />} />
                                        <Route path="/contact" element={<ContactPage />} />
                                        <Route path="/order-success" element={<OrderSuccessPage />} />
                                        
                                        <Route element={<ProtectedRoute />}>
                                          <Route path="/dashboard" element={<Dashboard />} />
                                          <Route path="/products" element={<ProductsPage />} />
                                          <Route path="/products/:id" element={<ProductPage />} />
                                          <Route path="/categories" element={<Categories />} />
                                          <Route path="/customers" element={<Customers />} />
                                          <Route path="/customers/:id" element={<ManageCustomer />} />
                                          <Route path="/customer-products" element={<CustomerProducts />} />
                                          <Route path="/customer-list" element={<CustomerList />} />
                                          <Route path="/rooms" element={<Rooms />} />
                                          <Route path="/units" element={<Units />} />
                                          <Route path="/purchase-orders" element={<PurchaseOrders />} />
                                          <Route path="/vendors" element={<Vendors />} />
                                          <Route path="/stock-movements" element={<StockMovements />} />
                                          <Route path="/bins" element={<Bins />} />
                                          <Route path="/sku-matrix" element={<UnitMatrixPage />} />
                                          <Route path="/users" element={<Users />} />
                                          <Route path="/notifications" element={<Notifications />} />
                                          <Route path="/settings" element={<Settings />} />
                                          <Route path="/reports" element={<Reports />} />
                                          <Route path="/wizard" element={<WizardPage />} />
                                          <Route path="/inventory" element={<Inventory />} />
                                          <Route path="/profile" element={<Profile />} />
                                          
                                          <Route path="/favorites" element={<FavoritesPage />} />
                                          <Route path="/compare" element={<ComparePage />} />
                                          <Route path="/cart" element={<CartPage />} />
                                          <Route path="/checkout" element={<CheckoutPage />} />
                                          <Route path="/promotions" element={<PromotionsPage />} />
                                          <Route path="/orders" element={<OrdersPage />} />
                                          <Route path="/orders/:id" element={<OrderDetailsPage />} />
                                        </Route>
                                        
                                        <Route path="*" element={<NotFound />} />
                                      </Routes>
                                      <Toaster />
                                    </BrowserRouter>
                                  </CartProvider>
                                </ComparisonProvider>
                              </FavoritesProvider>
                            </WizardProvider>
                          </POProvider>
                        </UnitMatrixProvider>
                      </BinProvider>
                    </ProductProvider>
                  </CustomerProductProvider>
                </UnitProvider>
              </RoomProvider>
            </CustomerProvider>
          </UserProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
