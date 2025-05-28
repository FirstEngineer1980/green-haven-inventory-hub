import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { NotificationProvider } from './context/NotificationContext';
import { UserProvider } from './context/UserContext';
import { TranslationProvider } from './context/TranslationContext';
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

// CRM Pages
import CRMDashboard from './pages/crm/CRMDashboard';
import SellersPage from './pages/crm/SellersPage';
import ClientsPage from './pages/crm/ClientsPage';

import ProtectedRoute from './components/auth/ProtectedRoute';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TranslationProvider>
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
                                          <CategoryProvider>
                                            <PromotionProvider>
                                              <Routes>
                                                <Route path="/" element={<Index />} />
                                                <Route path="/login" element={<Login />} />
                                                <Route path="/unauthorized" element={<Unauthorized />} />
                                                <Route path="/about" element={<AboutPage />} />
                                                <Route path="/contact" element={<ContactPage />} />
                                                <Route path="/order-success" element={<OrderSuccessPage />} />

                                                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                                                <Route path="/products" element={<ProtectedRoute><ProductsPage /></ProtectedRoute>} />
                                                <Route path="/products/:id" element={<ProtectedRoute><ProductPage /></ProtectedRoute>} />
                                                <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
                                                <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
                                                <Route path="/customers/:id" element={<ProtectedRoute><ManageCustomer /></ProtectedRoute>} />
                                                <Route path="/customer-products" element={<ProtectedRoute><CustomerProducts /></ProtectedRoute>} />
                                                <Route path="/customer-list" element={<ProtectedRoute><CustomerList /></ProtectedRoute>} />
                                                <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
                                                <Route path="/units" element={<ProtectedRoute><Units /></ProtectedRoute>} />
                                                <Route path="/purchase-orders" element={<ProtectedRoute><PurchaseOrders /></ProtectedRoute>} />
                                                <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
                                                <Route path="/stock-movements" element={<ProtectedRoute><StockMovements /></ProtectedRoute>} />
                                                <Route path="/bins" element={<ProtectedRoute><Bins /></ProtectedRoute>} />
                                                <Route path="/sku-matrix" element={<ProtectedRoute><UnitMatrixPage /></ProtectedRoute>} />
                                                <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
                                                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                                                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                                                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                                                <Route path="/wizard" element={<ProtectedRoute><WizardPage /></ProtectedRoute>} />
                                                <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                                                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                                                <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
                                                <Route path="/compare" element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />
                                                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                                                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                                                <Route path="/promotions" element={<ProtectedRoute><PromotionsPage /></ProtectedRoute>} />
                                                <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                                                <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />

                                                {/* CRM Routes */}
                                                <Route path="/crm" element={<ProtectedRoute><CRMDashboard /></ProtectedRoute>} />
                                                <Route path="/crm/sellers" element={<ProtectedRoute><SellersPage /></ProtectedRoute>} />
                                                <Route path="/crm/clients" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />

                                                <Route path="*" element={<NotFound />} />
                                              </Routes>
                                              <Toaster />
                                            </PromotionProvider>
                                          </CategoryProvider>
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
        </TranslationProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
