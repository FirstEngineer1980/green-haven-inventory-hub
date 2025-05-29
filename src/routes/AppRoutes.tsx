
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Categories from '@/pages/Categories';
import Customers from '@/pages/Customers';
import CustomerProducts from '@/pages/CustomerProducts';
import Rooms from '@/pages/Rooms';
import Units from '@/pages/Units';
import PurchaseOrders from '@/pages/PurchaseOrders';
import Vendors from '@/pages/Vendors';
import Bins from '@/pages/Bins';
import SkuMatrixPage from '@/pages/SkuMatrixPage';
import StockMovements from '@/pages/StockMovements';
import Inventory from '@/pages/Inventory';
import SellersPage from '@/pages/crm/SellersPage';
import ClientsPage from '@/pages/crm/ClientsPage';
import CRMDashboard from '@/pages/crm/CRMDashboard';
import SellerCommissionPage from '@/pages/crm/SellerCommissionPage';
import Users from '@/pages/Users';
import Reports from '@/pages/Reports';
import Notifications from '@/pages/Notifications';
import Settings from '@/pages/Settings';
import ExportImportManager from '@/pages/ExportImportManager';
import InvoicesPage from '@/pages/InvoicesPage';
import Unauthorized from '@/pages/Unauthorized';
import { useAuth } from '@/context/AuthContext';

const AppRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/customer-products" element={<CustomerProducts />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/units" element={<Units />} />
      <Route path="/purchase-orders" element={<PurchaseOrders />} />
      <Route path="/vendors" element={<Vendors />} />
      <Route path="/bins" element={<Bins />} />
      <Route path="/sku-matrix" element={<SkuMatrixPage />} />
      <Route path="/stock-movements" element={<StockMovements />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/crm" element={<CRMDashboard />} />
      <Route path="/crm/sellers" element={<SellersPage />} />
      <Route path="/crm/clients" element={<ClientsPage />} />
      <Route path="/crm/seller-commission" element={<SellerCommissionPage />} />
      <Route path="/users" element={<Users />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/data-management" element={<ExportImportManager />} />
      <Route path="/invoices" element={<InvoicesPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
