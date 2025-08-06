
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { CustomerProvider } from '@/context/CustomerContext';
import { CustomerProductProvider } from '@/context/CustomerProductContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import CustomerProducts from '@/pages/CustomerProducts';
import ManageCustomer from '@/pages/ManageCustomer';
import OrdersPage from '@/pages/OrdersPage';
import ManageOrder from '@/pages/ManageOrder';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CustomerProvider>
          <CustomerProductProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customer-products"
                  element={
                    <ProtectedRoute>
                      <CustomerProducts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customers"
                  element={
                    <ProtectedRoute>
                      <ManageCustomer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customers/manage"
                  element={
                    <ProtectedRoute>
                      <ManageCustomer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customers/manage/:customerId"
                  element={
                    <ProtectedRoute>
                      <ManageCustomer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/manage"
                  element={
                    <ProtectedRoute>
                      <ManageOrder />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/manage/:orderId"
                  element={
                    <ProtectedRoute>
                      <ManageOrder />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Router>
            <Toaster />
          </CustomerProductProvider>
        </CustomerProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
