
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProductProvider } from './context/ProductContext';
import { UserProvider } from './context/UserContext';
import { CustomerProvider } from './context/CustomerContext';
import { CustomerProductProvider } from './context/CustomerProductContext';
import { RoomProvider } from './context/RoomContext';
import { UnitProvider } from './context/UnitContext';
import { UnitMatrixProvider } from './context/UnitMatrixContext';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Products from './pages/Products';
import Users from './pages/Users';
import Notifications from './pages/Notifications';
import Unauthorized from './pages/Unauthorized';
import NotFound from "./pages/NotFound";
import Inventory from './pages/Inventory';
import StockMovements from './pages/StockMovements';
import Reports from './pages/Reports';
import Customers from './pages/Customers';
import CustomerProducts from './pages/CustomerProducts';
import ManageCustomer from './pages/ManageCustomer';
import CustomerList from './pages/CustomerList';
import Rooms from './pages/Rooms';
import Units from './pages/Units';
import UnitMatrixPage from './pages/UnitMatrixPage';
import SkuMatrixPage from './pages/SkuMatrixPage'; // Add the import
import Settings from './pages/Settings';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <ProductProvider>
            <UserProvider>
              <CustomerProvider>
                <CustomerProductProvider>
                  <RoomProvider>
                    <UnitProvider>
                      <UnitMatrixProvider>
                        <TooltipProvider>
                          <Toaster />
                          <Sonner />
                          <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/inventory" element={<Inventory />} />
                            <Route path="/stock-movements" element={<StockMovements />} />
                            <Route path="/reports" element={<Reports />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/customers" element={<Customers />} />
                            <Route path="/customer-products" element={<CustomerProducts />} />
                            <Route path="/customers/manage" element={<ManageCustomer />} />
                            <Route path="/customers/manage/:customerId" element={<ManageCustomer />} />
                            <Route path="/customer-list/:customerId" element={<CustomerList />} />
                            <Route path="/rooms" element={<Rooms />} />
                            <Route path="/units" element={<Units />} />
                            <Route path="/unit-matrix" element={<UnitMatrixPage />} />
                            <Route path="/sku-matrix" element={<SkuMatrixPage />} /> {/* Add the new route */}
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/unauthorized" element={<Unauthorized />} />
                            <Route path="/" element={<Login />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </TooltipProvider>
                      </UnitMatrixProvider>
                    </UnitProvider>
                  </RoomProvider>
                </CustomerProductProvider>
              </CustomerProvider>
            </UserProvider>
          </ProductProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
