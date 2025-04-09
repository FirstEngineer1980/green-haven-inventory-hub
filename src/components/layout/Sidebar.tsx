
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Package,
  Users,
  ShoppingCart,
  LayoutDashboard,
  Bell,
  Settings,
  Building2,
  Home,
  Grid3X3,
  Table,
  Menu,
  Database,
} from 'lucide-react';

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const Sidebar = ({ className }: { className?: string }) => {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile, openMobile } = useSidebar();

  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: 'Products',
      href: '/products',
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: 'Inventory',
      icon: <ShoppingCart className="h-5 w-5" />,
      subItems: [
        {
          title: 'Stock Items',
          href: '/inventory',
        },
        {
          title: 'Stock Movements',
          href: '/stock-movements',
        },
      ],
    },
    {
      title: 'Reports',
      href: '/reports',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: 'Users',
      href: '/users',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Customers',
      icon: <Building2 className="h-5 w-5" />,
      subItems: [
        {
          title: 'Manage Customers',
          href: '/customers',
        },
        {
          title: 'Customer Products',
          href: '/customer-products',
        },
      ],
    },
    {
      title: 'Rooms',
      href: '/rooms',
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: 'Units',
      href: '/units',
      icon: <Grid3X3 className="h-5 w-5" />,
    },
    {
      title: 'Unit Matrix',
      href: '/unit-matrix',
      icon: <Table className="h-5 w-5" />,
    },
    {
      title: 'SKU Matrix',
      href: '/sku-matrix',
      icon: <Database className="h-5 w-5" />,
    },
    {
      title: 'Notifications',
      href: '/notifications',
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const handleMenuItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Mobile menu toggle button that appears in the header
  const MobileMenuButton = () => {
    if (!isMobile) return null;

    return (
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setOpenMobile(!openMobile)}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle mobile menu</span>
      </Button>
    );
  };

  return (
    <>
      <MobileMenuButton />
      <ShadcnSidebar className={className}>
        <SidebarHeader className="pb-2">
          <h2 className="px-4 text-xl font-semibold tracking-tight truncate">
            Storage Manager
          </h2>
        </SidebarHeader>
        <SidebarContent className="overflow-y-auto">
          <SidebarMenu>
            {navItems.map((item, i) => {
              if (item.subItems) {
                const isSubItemActive = item.subItems.some(
                  (subItem) => subItem.href === pathname
                );
                
                return (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuButton 
                      isActive={isSubItemActive}
                      tooltip={item.title}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                    
                    <SidebarMenuSub>
                      {item.subItems.map((subItem, j) => (
                        <SidebarMenuSubButton
                          key={j}
                          asChild
                          isActive={pathname === subItem.href}
                        >
                          <Link to={subItem.href} onClick={handleMenuItemClick}>
                            {subItem.title}
                          </Link>
                        </SidebarMenuSubButton>
                      ))}
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                );
              }
              
              return (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link to={item.href} onClick={handleMenuItemClick}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarTrigger />
        </SidebarFooter>
      </ShadcnSidebar>
    </>
  );
};

export default Sidebar;
