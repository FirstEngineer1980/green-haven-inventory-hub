import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { CustomerProvider } from '@/context/CustomerContext';
import { CustomerProductProvider } from '@/context/CustomerProductContext';
import { ProductProvider } from '@/context/ProductContext';
import { CategoryProvider } from '@/context/CategoryContext';
import { POProvider } from '@/context/POContext';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { ComparisonProvider } from '@/context/ComparisonContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import CustomerProducts from '@/pages/CustomerProducts';
import ManageCustomer from '@/pages/ManageCustomer';
import OrdersPage from '@/pages/OrdersPage';
import ManageOrder from '@/pages/ManageOrder';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <NotificationProvider>
                    <CustomerProvider>
                        <CustomerProductProvider>
                            <ProductProvider>
                                <CategoryProvider>
                                    <POProvider>
                                        <CartProvider>
                                            <FavoritesProvider>
                                                <ComparisonProvider>
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
                                                </ComparisonProvider>
                                            </FavoritesProvider>
                                        </CartProvider>
                                    </POProvider>
                                </CategoryProvider>
                            </ProductProvider>
                        </CustomerProductProvider>
                    </CustomerProvider>
                </NotificationProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;