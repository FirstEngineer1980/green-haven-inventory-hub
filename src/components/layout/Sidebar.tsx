
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Boxes, 
  ClipboardList, 
  Warehouse, 
  Grid3X3, 
  TruckIcon, 
  ShoppingCart, 
  FileText, 
  Settings, 
  BellRing,
  Layers,
  FolderTree
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

interface SidebarItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  permission?: string;
}

const sections: Record<string, SidebarItem[]> = {
  main: [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/dashboard',
    },
  ],
  inventory: [
    {
      title: 'Products',
      icon: <Package className="h-5 w-5" />,
      href: '/products',
      permission: 'manage_products',
    },
    {
      title: 'Categories',
      icon: <FolderTree className="h-5 w-5" />,
      href: '/categories',
      permission: 'manage_products',
    },
    {
      title: 'Stock Movements',
      icon: <Boxes className="h-5 w-5" />,
      href: '/stock-movements',
      permission: 'manage_inventory',
    },
    {
      title: 'Bins',
      icon: <Layers className="h-5 w-5" />,
      href: '/bins',
      permission: 'manage_inventory',
    },
  ],
  customers: [
    {
      title: 'Customers',
      icon: <Users className="h-5 w-5" />,
      href: '/customers',
    },
    {
      title: 'Customer Products',
      icon: <ClipboardList className="h-5 w-5" />,
      href: '/customer-products',
    },
    {
      title: 'Rooms',
      icon: <Warehouse className="h-5 w-5" />,
      href: '/rooms',
    },
    {
      title: 'Units',
      icon: <Grid3X3 className="h-5 w-5" />,
      href: '/units',
    },
    {
      title: 'SKU Matrix',
      icon: <Grid3X3 className="h-5 w-5" />,
      href: '/sku-matrix',
    },
  ],
  purchasing: [
    {
      title: 'Purchase Orders',
      icon: <TruckIcon className="h-5 w-5" />,
      href: '/purchase-orders',
    },
    {
      title: 'Vendors',
      icon: <ShoppingCart className="h-5 w-5" />,
      href: '/vendors',
    },
  ],
  management: [
    {
      title: 'Reports',
      icon: <FileText className="h-5 w-5" />,
      href: '/reports',
      permission: 'view_reports',
    },
    {
      title: 'Users',
      icon: <Users className="h-5 w-5" />,
      href: '/users',
      permission: 'manage_users',
    },
    {
      title: 'Notifications',
      icon: <BellRing className="h-5 w-5" />,
      href: '/notifications',
      permission: 'manage_notifications',
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      href: '/settings',
    },
  ],
};

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const { currentUser } = useAuth();

  // Check if user has the required permission
  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    if (!currentUser) return false;
    return currentUser.permissions.includes(permission);
  };

  return (
    <div className={cn("pb-12 border-r h-full", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">
            Inventory System
          </h2>
          <ScrollArea className="h-[calc(100vh-9rem)]">
            <div className="space-y-8">
              {Object.entries(sections).map(([sectionKey, items]) => {
                const filteredItems = items.filter(item => hasPermission(item.permission));
                if (filteredItems.length === 0) return null;
                
                return (
                  <div key={sectionKey} className="space-y-2">
                    <div className="px-4 font-medium uppercase text-xs text-muted-foreground">
                      {sectionKey === 'main' ? '' : sectionKey}
                    </div>
                    {filteredItems.map((item) => (
                      <div key={item.href}>
                        <Link to={item.href}>
                          <Button
                            variant={location.pathname === item.href ? 'secondary' : 'ghost'}
                            className="w-full justify-start"
                          >
                            {item.icon}
                            <span className="ml-2">{item.title}</span>
                          </Button>
                        </Link>
                      </div>
                    ))}
                    <Separator />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
