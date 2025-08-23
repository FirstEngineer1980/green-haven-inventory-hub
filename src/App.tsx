import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { CustomerProvider } from '@/context/CustomerContext';
import { CustomerProductProvider } from '@/context/CustomerProductContext';
import { ProductProvider } from '@/context/ProductContext';
import { CategoryProvider } from '@/context/CategoryContext';
import { POProvider } from '@/context/POContext';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { ComparisonProvider } from '@/context/ComparisonContext';
import { RoomProvider } from '@/context/RoomContext';
import { UnitProvider } from '@/context/UnitContext';
import { SkuMatrixProvider } from '@/context/SkuMatrixContext';
import { BinProvider } from '@/context/BinContext';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Login from '@/pages/Login';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import CustomerProducts from '@/pages/CustomerProducts';
import ManageCustomer from '@/pages/ManageCustomer';
import OrdersPage from '@/pages/OrdersPage';
import ManageOrder from '@/pages/ManageOrder';
import ProductsPage from '@/pages/ProductsPage';
import ProductPage from '@/pages/ProductPage';
import './App.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

// Main App component that handles routing
const AppContent = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
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
                path="/products"
                element={
                    <ProtectedRoute>
                        <ProductsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/products/:id"
                element={
                    <ProtectedRoute>
                        <ProductPage />
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
            <Route path="*" element={isAuthenticated ? <Index /> : <Navigate to="/login" replace />} />
        </Routes>
    );
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <Router>
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
                                                            <RoomProvider>
                                                                <UnitProvider>
                                                                    <SkuMatrixProvider>
                                                                        <BinProvider>
                                                                            <AppContent />
                                                                            <Toaster />
                                                                        </BinProvider>
                                                                    </SkuMatrixProvider>
                                                                </UnitProvider>
                                                            </RoomProvider>
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
                </Router>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;