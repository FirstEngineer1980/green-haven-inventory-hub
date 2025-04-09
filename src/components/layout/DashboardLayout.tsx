
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: React.ReactNode;
  requiredPermission?: 'manage_users' | 'manage_products' | 'view_reports' | 'manage_inventory' | 'manage_notifications';
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, requiredPermission }) => {
  const { isAuthenticated, hasPermission } = useAuth();
  const isMobile = useIsMobile();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check for required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <SidebarProvider defaultOpen={!isMobile} openMobile={false}>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
