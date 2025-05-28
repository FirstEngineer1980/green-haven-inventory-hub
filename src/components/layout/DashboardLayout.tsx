
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
  // const { isAuthenticated, hasPermission } = useAuth();
  const isMobile = useIsMobile();
  const { user, isLoading } = useAuth();

  // Redirect to login if not authenticated
  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // Check for required permission
  // if (requiredPermission && !hasPermission(requiredPermission)) {
  //   return <Navigate to="/unauthorized" />;
  // }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
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
