
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
import { POProvider } from './context/POContext';
import Bins from './pages/Bins';

// Import other pages here as needed
// These are placeholders until the actual components are created
const Login = () => <div>Login Page</div>;
const Dashboard = () => <div>Dashboard Page</div>;
const Products = () => <div>Products Page</div>;
const Inventory = () => <div>Inventory Page</div>;
const StockMovements = () => <div>Stock Movements Page</div>;
const Reports = () => <div>Reports Page</div>;
const Users = () => <div>Users Page</div>;
const Customers = () => <div>Customers Page</div>;
const CustomerProducts = () => <div>Customer Products Page</div>;
const ManageCustomer = () => <div>Manage Customer Page</div>;
const CustomerList = () => <div>Customer List Page</div>;
const Rooms = () => <div>Rooms Page</div>;
const Units = () => <div>Units Page</div>;
const UnitMatrixPage = () => <div>Unit Matrix Page</div>;
const SkuMatrixPage = () => <div>SKU Matrix Page</div>;
const PurchaseOrders = () => <div>Purchase Orders Page</div>;
const Vendors = () => <div>Vendors Page</div>;
const Notifications = () => <div>Notifications Page</div>;
const Settings = () => <div>Settings Page</div>;
const Unauthorized = () => <div>Unauthorized Page</div>;
const NotFound = () => <div>Not Found Page</div>;

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
                        <POProvider>
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
                              <Route path="/sku-matrix" element={<SkuMatrixPage />} />
                              <Route path="/purchase-orders" element={<PurchaseOrders />} />
                              <Route path="/vendors" element={<Vendors />} />
                              <Route path="/notifications" element={<Notifications />} />
                              <Route path="/settings" element={<Settings />} />
                              <Route path="/unauthorized" element={<Unauthorized />} />
                              <Route path="/bins" element={<Bins />} />
                              <Route path="/" element={<Login />} />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </TooltipProvider>
                        </POProvider>
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
