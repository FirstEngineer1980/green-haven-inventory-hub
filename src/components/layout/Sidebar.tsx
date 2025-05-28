
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Home,
  Package,
  Users,
  ShoppingCart,
  Truck,
  BarChart3,
  Settings,
  Bell,
  FileText,
  Boxes,
  Building,
  UserCheck,
  Layers,
  Calculator,
  Briefcase,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const mainNavItems = [
    { title: 'Dashboard', url: '/dashboard', icon: Home },
    { title: 'Products', url: '/products', icon: Package },
    { title: 'Categories', url: '/categories', icon: Layers },
    { title: 'Customers', url: '/customers', icon: Users },
    { title: 'Customer Products', url: '/customer-products', icon: Package },
    { title: 'Rooms', url: '/rooms', icon: Building },
    { title: 'Units', url: '/units', icon: Boxes },
    { title: 'Purchase Orders', url: '/purchase-orders', icon: ShoppingCart },
    { title: 'Vendors', url: '/vendors', icon: Truck },
    { title: 'Bins', url: '/bins', icon: Package },
    { title: 'SKU Matrix', url: '/sku-matrix', icon: Calculator },
    { title: 'Stock Movements', url: '/stock-movements', icon: BarChart3 },
    { title: 'Inventory', url: '/inventory', icon: Package },
  ];

  const crmNavItems = [
    { title: 'CRM Dashboard', url: '/crm', icon: BarChart3 },
    { title: 'Sellers', url: '/crm/sellers', icon: UserCheck },
    { title: 'Clients', url: '/crm/clients', icon: UserPlus },
  ];

  const systemNavItems = [
    { title: 'Users', url: '/users', icon: Users },
    { title: 'Reports', url: '/reports', icon: FileText },
    { title: 'Notifications', url: '/notifications', icon: Bell },
    { title: 'Settings', url: '/settings', icon: Settings },
  ];

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  const isActive = (url: string) => {
    return location.pathname === url;
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold">Inventory System</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.url)}
                    className={cn(
                      "w-full justify-start",
                      isActive(item.url) && "bg-accent text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>CRM</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {crmNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.url)}
                    className={cn(
                      "w-full justify-start",
                      isActive(item.url) && "bg-accent text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    onClick={() => handleNavigation(item.url)}
                    className={cn(
                      "w-full justify-start",
                      isActive(item.url) && "bg-accent text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenuButton onClick={logout} className="w-full">
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
