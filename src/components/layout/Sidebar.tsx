
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingCart,
  Tag,
  Users,
  ShoppingBag,
  Store,
  Package,
  Boxes,
  BarChart,
  Settings,
  Bell,
  User,
  HelpCircle,
  BadgePercent,
  Eye
} from 'lucide-react';
import { Permission } from '@/types';

interface NavItemProps {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarSection {
  name: string;
  icon: React.ReactNode;
  permissions: Permission[];
  submenus: NavItemProps[];
}

const Sidebar: React.FC = () => {
  const { currentUser, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const sidebarSections: SidebarSection[] = [
    {
      name: 'General',
      icon: <LayoutDashboard className="h-4 w-4" />,
      permissions: ['manage_users', 'manage_products', 'view_reports', 'manage_inventory'],
      submenus: [
        {
          name: 'Dashboard',
          path: '/dashboard',
          icon: <LayoutDashboard className="h-4 w-4" />,
        },
      ]
    },
    {
      name: 'E-Commerce',
      icon: <ShoppingCart className="h-4 w-4" />,
      permissions: ['manage_products'],
      submenus: [
        {
          name: 'Products',
          path: '/products',
          icon: <ShoppingBag className="h-4 w-4" />,
        },
        {
          name: 'Categories',
          path: '/categories',
          icon: <Tag className="h-4 w-4" />,
        },
        {
          name: 'Promotions',
          path: '/promotions',
          icon: <BadgePercent className="h-4 w-4" />,
        },
        {
          name: 'Orders',
          path: '/orders',
          icon: <ShoppingCart className="h-4 w-4" />,
        },
      ]
    },
    {
      name: 'Inventory',
      icon: <Store className="h-4 w-4" />,
      permissions: ['manage_inventory'],
      submenus: [
        {
          name: 'Stock Control',
          path: '/inventory',
          icon: <Boxes className="h-4 w-4" />,
        },
        {
          name: 'Stock Movements',
          path: '/stock-movements',
          icon: <Package className="h-4 w-4" />,
        },
        {
          name: 'Purchase Orders',
          path: '/purchase-orders',
          icon: <ShoppingCart className="h-4 w-4" />,
        },
        {
          name: 'Bins',
          path: '/bins',
          icon: <Store className="h-4 w-4" />,
        },
        {
          name: 'SKU Matrix',
          path: '/sku-matrix',
          icon: <Boxes className="h-4 w-4" />,
        },
      ]
    },
    {
      name: 'Customers',
      icon: <Users className="h-4 w-4" />,
      permissions: ['manage_users'],
      submenus: [
        {
          name: 'Customer List',
          path: '/customer-list',
          icon: <Users className="h-4 w-4" />,
        },
        {
          name: 'Customer Products',
          path: '/customer-products',
          icon: <ShoppingCart className="h-4 w-4" />,
        },
      ]
    },
    {
      name: 'Administration',
      icon: <Settings className="h-4 w-4" />,
      permissions: ['manage_users'],
      submenus: [
        {
          name: 'Users',
          path: '/users',
          icon: <Users className="h-4 w-4" />,
        },
        {
          name: 'Notifications',
          path: '/notifications',
          icon: <Bell className="h-4 w-4" />,
        },
        {
          name: 'Settings',
          path: '/settings',
          icon: <Settings className="h-4 w-4" />,
        },
        {
          name: 'Reports',
          path: '/reports',
          icon: <BarChart className="h-4 w-4" />,
        },
      ]
    },
    {
      name: 'Marketing',
      icon: <BadgePercent className="h-4 w-4" />,
      permissions: ['manage_products'],
      submenus: [
        {
          name: 'Manage Promotions',
          path: '/manage-promotions',
          icon: <Tag className="h-4 w-4" />,
        },
        {
          name: 'View Promotions',
          path: '/promotions',
          icon: <Eye className="h-4 w-4" />,
        }
      ]
    },
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4">
        <h1 className="text-lg font-semibold text-white">Inventory System</h1>
        <p className="text-sm text-blue-100">
          {currentUser?.name ? `Welcome, ${currentUser.name.split(' ')[0]}!` : 'Welcome!'}
        </p>
      </div>

      <Separator className="bg-blue-400" />

      <NavigationMenu className="flex-1">
        {sidebarSections.map((section, index) => (
          <div key={index}>
            {section.permissions.some(permission => hasPermission(permission)) ? (
              <>
                <div className="px-6 py-2 text-sm font-semibold text-blue-100">
                  {section.name}
                </div>
                <NavigationMenuList className="flex-col">
                  {section.submenus.map((item, idx) => (
                    <NavigationMenuItem key={idx}>
                      <NavigationMenuLink
                        className={cn(
                          "group flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium transition-colors hover:bg-blue-600 hover:text-white data-[active]:bg-blue-600 data-[active]:text-white",
                          location.pathname === item.path ? "bg-blue-600 text-white" : "text-blue-100"
                        )}
                        onClick={() => navigate(item.path)}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
                <Separator className="bg-blue-400 my-2" />
              </>
            ) : null}
          </div>
        ))}
      </NavigationMenu>

      <div className="mt-auto px-6 py-4">
        <Separator className="bg-blue-400 mb-2" />
        <NavigationMenu>
          <NavigationMenuList className="flex-col">
            <NavigationMenuItem>
              <NavigationMenuLink
                className="group flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium transition-colors hover:bg-blue-600 hover:text-white text-blue-100"
                onClick={() => navigate('/profile')}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className="group flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium transition-colors hover:bg-blue-600 hover:text-white text-blue-100"
                onClick={() => navigate('/help')}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Help</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-80 border-0 bg-blue-500 pt-0 text-white">
          <SheetHeader className="pl-0 pr-6">
            <SheetTitle className="text-white">Menu</SheetTitle>
            <SheetDescription className="text-blue-100">
              Navigate through the inventory system.
            </SheetDescription>
          </SheetHeader>
          {renderSidebarContent()}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 text-white hover:bg-blue-600" 
            onClick={() => {
              const closeButton = document.querySelector('[data-radix-collection-item]');
              if (closeButton instanceof HTMLElement) {
                closeButton.click();
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span className="sr-only">Close menu</span>
          </Button>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="hidden border-r bg-blue-500 w-60 flex-col md:flex">
      {renderSidebarContent()}
    </aside>
  );
};

export default Sidebar;
