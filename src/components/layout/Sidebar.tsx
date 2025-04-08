
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
} from 'lucide-react';

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarProvider,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarFooter,
} from '@/components/ui/sidebar';

const Sidebar = ({ className }: { className?: string }) => {
  const { pathname } = useLocation();

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
      href: '/customers',
      icon: <Building2 className="h-5 w-5" />,
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

  return (
    <ShadcnSidebar className={className}>
      <SidebarHeader className="pb-2">
        <h2 className="px-4 text-xl font-semibold tracking-tight">
          Storage Manager
        </h2>
      </SidebarHeader>
      <SidebarContent>
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
                        <Link to={subItem.href}>{subItem.title}</Link>
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
                  <Link to={item.href}>
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
  );
};

export default Sidebar;
