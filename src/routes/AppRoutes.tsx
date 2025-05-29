
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import SellersPage from '@/pages/crm/SellersPage';
import SellerCommissionPage from '@/pages/crm/SellerCommissionPage';
import ExportImportManager from '@/pages/ExportImportManager';
import InvoicesPage from '@/pages/InvoicesPage';
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
      <Route path="/crm/sellers" element={<SellersPage />} />
      <Route path="/crm/seller-commission" element={<SellerCommissionPage />} />
      <Route path="/data-management" element={<ExportImportManager />} />
      <Route path="/invoices" element={<InvoicesPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
