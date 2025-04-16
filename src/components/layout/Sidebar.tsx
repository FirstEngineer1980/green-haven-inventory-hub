import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SidebarClose, SidebarOpen } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { useAuth } from '@/context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingCart,
  Category,
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
  Tag,
  Eye
} from 'lucide-react';

interface NavItemProps {
  name: string;
  path: string;
  icon: React.ReactNode;
}

interface SidebarSection {
  name: string;
  icon: React.ReactNode;
  permissions: string[];
  submenus: NavItemProps[];
}

const Sidebar: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const sidebarSections: SidebarSection[] = [
    {
      name: 'General',
      icon: LayoutDashboard,
      permissions: ['admin', 'manager', 'staff', 'customer'],
      submenus: [
        {
          name: 'Dashboard',
          path: '/dashboard',
          icon: LayoutDashboard,
        },
      ]
    },
    {
      name: 'E-Commerce',
      icon: ShoppingCart,
      permissions: ['admin', 'manager', 'staff'],
      submenus: [
        {
          name: 'Products',
          path: '/products',
          icon: ShoppingBag,
        },
        {
          name: 'Categories',
          path: '/categories',
          icon: Category,
        },
        {
          name: 'Promotions',
          path: '/promotions',
          icon: BadgePercent,
        },
        {
          name: 'Orders',
          path: '/orders',
          icon: ShoppingCart,
        },
      ]
    },
    {
      name: 'Inventory',
      icon: Store,
      permissions: ['admin', 'manager'],
      submenus: [
        {
          name: 'Stock Control',
          path: '/inventory',
          icon: Boxes,
        },
        {
          name: 'Stock Movements',
          path: '/stock-movements',
          icon: Package,
        },
        {
          name: 'Purchase Orders',
          path: '/purchase-orders',
          icon: ShoppingCart,
        },
        {
          name: 'Bins',
          path: '/bins',
          icon: Store,
        },
        {
          name: 'SKU Matrix',
          path: '/sku-matrix',
          icon: Boxes,
        },
      ]
    },
    {
      name: 'Customers',
      icon: Users,
      permissions: ['admin', 'manager'],
      submenus: [
        {
          name: 'Customer List',
          path: '/customer-list',
          icon: Users,
        },
        {
          name: 'Customer Products',
          path: '/customer-products',
          icon: ShoppingCart,
        },
      ]
    },
    {
      name: 'Administration',
      icon: Settings,
      permissions: ['admin'],
      submenus: [
        {
          name: 'Users',
          path: '/users',
          icon: Users,
        },
        {
          name: 'Notifications',
          path: '/notifications',
          icon: Bell,
        },
        {
          name: 'Settings',
          path: '/settings',
          icon: Settings,
        },
        {
          name: 'Reports',
          path: '/reports',
          icon: BarChart,
        },
      ]
    },
    {
      name: 'Marketing',
      icon: BadgePercent,
      permissions: ['admin', 'manager'],
      submenus: [
        {
          name: 'Manage Promotions',
          path: '/manage-promotions',
          icon: Tag,
        },
        {
          name: 'View Promotions',
          path: '/promotions',
          icon: Eye,
        }
      ]
    },
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4">
        <h1 className="text-lg font-semibold">Inventory System</h1>
        <p className="text-sm text-muted-foreground">
          {user ? `Welcome, ${user.firstName}!` : 'Welcome!'}
        </p>
      </div>

      <Separator />

      <NavigationMenu className="flex-1">
        {sidebarSections.map((section, index) => (
          <div key={index}>
            {hasPermission('admin') || section.permissions.some(permission => hasPermission(permission)) ? (
              <>
                <div className="px-6 py-2 text-sm font-semibold text-muted-foreground">
                  {section.name}
                </div>
                <NavigationMenuList>
                  {section.submenus.map((item, index) => (
                    <NavigationMenuItem key={index}>
                      <NavigationMenuLink
                        className={cn(
                          "group flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-accent-foreground data-[active]:bg-secondary data-[active]:text-accent-foreground",
                          location.pathname === item.path ? "bg-secondary text-accent-foreground" : "text-foreground"
                        )}
                        onClick={() => navigate(item.path)}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
                <Separator />
              </>
            ) : null}
          </div>
        ))}
      </NavigationMenu>

      <div className="mt-auto px-6 py-4">
        <Separator />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className="group flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-accent-foreground data-[active]:bg-secondary data-[active]:text-accent-foreground"
                onClick={() => navigate('/profile')}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className="group flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-accent-foreground data-[active]:bg-secondary data-[active]:text-accent-foreground"
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
          <SidebarOpen />
        </SheetTrigger>
        <SheetContent className="w-80 border-0 bg-secondary pt-0 text-foreground">
          <SheetHeader className="pl-0 pr-6">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Navigate through the inventory system.
            </SheetDescription>
          </SheetHeader>
          {renderSidebarContent()}
          <SidebarClose className="absolute right-4 top-4" />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="hidden border-r bg-secondary w-60 flex-col md:flex">
      {renderSidebarContent()}
    </aside>
  );
};

export default Sidebar;
