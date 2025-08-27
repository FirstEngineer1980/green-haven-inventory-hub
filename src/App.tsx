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
import { PromotionProvider } from '@/context/PromotionContext';
import { CRMProvider } from '@/context/CRMContext';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Pages
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Categories from '@/pages/Categories';
import Customers from '@/pages/Customers';
import CustomerProducts from '@/pages/CustomerProducts';
import CustomerList from '@/pages/CustomerList';
import Rooms from '@/pages/Rooms';
import Units from '@/pages/Units';
import PurchaseOrders from '@/pages/PurchaseOrders';
import Vendors from '@/pages/Vendors';
import StockMovements from '@/pages/StockMovements';
import Bins from '@/pages/Bins';
import UnitMatrixPage from '@/pages/UnitMatrixPage';
import Users from '@/pages/Users';
import ManageCustomer from '@/pages/ManageCustomer';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import Notifications from '@/pages/Notifications';
import Settings from '@/pages/Settings';
import Reports from '@/pages/Reports';
import WizardPage from '@/pages/WizardPage';
import Inventory from '@/pages/Inventory';
import Unauthorized from '@/pages/Unauthorized';
import Index from '@/pages/Index';
import Profile from '@/pages/Profile';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import LandingPage from '@/pages/LandingPage';
import ProductsPage from '@/pages/ProductsPage';
import ProductPage from '@/pages/ProductPage';
import FavoritesPage from '@/pages/FavoritesPage';
import ComparePage from '@/pages/ComparePage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import PromotionsPage from '@/pages/PromotionsPage';
import OrdersPage from '@/pages/OrdersPage';
import OrderDetailsPage from '@/pages/OrderDetailsPage';
import OrderSuccessPage from '@/pages/OrderSuccessPage';

// CRM Pages
import CRMDashboard from '@/pages/crm/CRMDashboard';
import SellersPage from '@/pages/crm/SellersPage';
import ClientsPage from '@/pages/crm/ClientsPage';
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
            {/* Public Routes */}
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" replace />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/landing" element={<LandingPage />} />

            {/* Protected Routes */}
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
                        <Products />
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
                path="/products-page"
                element={
                    <ProtectedRoute>
                        <ProductsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/categories"
                element={
                    <ProtectedRoute>
                        <Categories />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/customers"
                element={
                    <ProtectedRoute>
                        <Customers />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/customer-list"
                element={
                    <ProtectedRoute>
                        <CustomerList />
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
                path="/rooms"
                element={
                    <ProtectedRoute>
                        <Rooms />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/units"
                element={
                    <ProtectedRoute>
                        <Units />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/purchase-orders"
                element={
                    <ProtectedRoute>
                        <PurchaseOrders />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/vendors"
                element={
                    <ProtectedRoute>
                        <Vendors />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/stock-movements"
                element={
                    <ProtectedRoute>
                        <StockMovements />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/bins"
                element={
                    <ProtectedRoute>
                        <Bins />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/unit-matrix"
                element={
                    <ProtectedRoute>
                        <UnitMatrixPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/users"
                element={
                    <ProtectedRoute>
                        <Users />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/notifications"
                element={
                    <ProtectedRoute>
                        <Notifications />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/reports"
                element={
                    <ProtectedRoute>
                        <Reports />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/wizard"
                element={
                    <ProtectedRoute>
                        <WizardPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/inventory"
                element={
                    <ProtectedRoute>
                        <Inventory />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/unauthorized"
                element={
                    <ProtectedRoute>
                        <Unauthorized />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/favorites"
                element={
                    <ProtectedRoute>
                        <FavoritesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/compare"
                element={
                    <ProtectedRoute>
                        <ComparePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/cart"
                element={
                    <ProtectedRoute>
                        <CartPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/checkout"
                element={
                    <ProtectedRoute>
                        <CheckoutPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/promotions"
                element={
                    <ProtectedRoute>
                        <PromotionsPage />
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
                        <OrderDetailsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders/manage/:orderId"
                element={
                    <ProtectedRoute>
                        <OrderDetailsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/order-success"
                element={
                    <ProtectedRoute>
                        <OrderSuccessPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/crm"
                element={
                    <ProtectedRoute>
                        <CRMDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/crm/dashboard"
                element={
                    <ProtectedRoute>
                        <CRMDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/crm/sellers"
                element={
                    <ProtectedRoute>
                        <SellersPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/crm/clients"
                element={
                    <ProtectedRoute>
                        <ClientsPage />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={isAuthenticated ? <NotFound /> : <Navigate to="/login" replace />} />
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
                                                                             <PromotionProvider>
                                                                                 <CRMProvider>
                                                                                     <AppContent />
                                                                                     <Toaster />
                                                                                 </CRMProvider>
                                                                             </PromotionProvider>
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