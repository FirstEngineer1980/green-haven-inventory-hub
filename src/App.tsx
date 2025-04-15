
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';

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
                              <BrowserRouter>
                                <Routes>
                                  <Route path="/" element={<Index />} />
                                  <Route path="/login" element={<Login />} />
                                  <Route path="/unauthorized" element={<Unauthorized />} />
                                  
                                  <Route element={<ProtectedRoute />}>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/products" element={<Products />} />
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
                                  </Route>
                                  
                                  <Route path="*" element={<NotFound />} />
                                </Routes>
                                <Toaster position="top-right" />
                              </BrowserRouter>
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
