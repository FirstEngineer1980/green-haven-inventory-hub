
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Import all pages
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Customers from '@/pages/Customers';
import CustomerProducts from '@/pages/CustomerProducts';
import PurchaseOrders from '@/pages/PurchaseOrders';
import OrdersPage from '@/pages/OrdersPage';
import Vendors from '@/pages/Vendors';
import Categories from '@/pages/Categories';
import Inventory from '@/pages/Inventory';
import Rooms from '@/pages/Rooms';
import Units from '@/pages/Units';
import Bins from '@/pages/Bins';
import StockMovements from '@/pages/StockMovements';
import SkuMatrixPage from '@/pages/SkuMatrixPage';
import UnitMatrixPage from '@/pages/UnitMatrixPage';
import Settings from '@/pages/Settings';
import Notifications from '@/pages/Notifications';
import Reports from '@/pages/Reports';
import Users from '@/pages/Users';
import Profile from '@/pages/Profile';
import ExportImportManager from '@/pages/ExportImportManager';
import WizardPage from '@/pages/WizardPage';
import PromotionsPage from '@/pages/PromotionsPage';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

// CRM Pages
import CRMDashboard from '@/pages/crm/CRMDashboard';
import ClientsPage from '@/pages/crm/ClientsPage';
import SellersPage from '@/pages/crm/SellersPage';
import SellerCommissionPage from '@/pages/crm/SellerCommissionPage';
import CommissionDashboard from '@/pages/crm/CommissionDashboard';
import InvoicesPage from '@/pages/InvoicesPage';

// Shopify Pages
import ShopifyOrdersPage from '@/pages/shopify/ShopifyOrdersPage';
import ShopifyCustomersPage from '@/pages/shopify/ShopifyCustomersPage';
import ShopifyOrderDetailPage from '@/pages/shopify/ShopifyOrderDetailPage';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
      <Route path="/customer-products" element={<ProtectedRoute><CustomerProducts /></ProtectedRoute>} />
      <Route path="/purchase-orders" element={<ProtectedRoute><PurchaseOrders /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
      <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
      <Route path="/units" element={<ProtectedRoute><Units /></ProtectedRoute>} />
      <Route path="/bins" element={<ProtectedRoute><Bins /></ProtectedRoute>} />
      <Route path="/stock-movements" element={<ProtectedRoute><StockMovements /></ProtectedRoute>} />
      <Route path="/sku-matrix" element={<ProtectedRoute><SkuMatrixPage /></ProtectedRoute>} />
      <Route path="/unit-matrix" element={<ProtectedRoute><UnitMatrixPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/export-import" element={<ProtectedRoute><ExportImportManager /></ProtectedRoute>} />
      <Route path="/wizard" element={<ProtectedRoute><WizardPage /></ProtectedRoute>} />
      <Route path="/promotions" element={<ProtectedRoute><PromotionsPage /></ProtectedRoute>} />
      
      {/* CRM Routes */}
      <Route path="/crm" element={<ProtectedRoute><CRMDashboard /></ProtectedRoute>} />
      <Route path="/crm/clients" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />
      <Route path="/crm/sellers" element={<ProtectedRoute><SellersPage /></ProtectedRoute>} />
      <Route path="/crm/seller-commissions" element={<ProtectedRoute><SellerCommissionPage /></ProtectedRoute>} />
      <Route path="/crm/commission-dashboard" element={<ProtectedRoute><CommissionDashboard /></ProtectedRoute>} />
      <Route path="/invoices" element={<ProtectedRoute><InvoicesPage /></ProtectedRoute>} />
      
      {/* Shopify Routes */}
      <Route path="/shopify/orders" element={<ProtectedRoute><ShopifyOrdersPage /></ProtectedRoute>} />
      <Route path="/shopify/customers" element={<ProtectedRoute><ShopifyCustomersPage /></ProtectedRoute>} />
      <Route path="/shopify/orders/:orderId" element={<ProtectedRoute><ShopifyOrderDetailPage /></ProtectedRoute>} />
      
      {/* Error routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
