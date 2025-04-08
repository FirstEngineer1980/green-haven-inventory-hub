
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
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <aside className={cn('pb-12', className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">
            Storage Manager
          </h2>
          <div className="space-y-1">
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="space-y-1">
                {navItems.map((item, i) => {
                  if (item.subItems) {
                    const isSubItemActive = item.subItems.some(
                      (subItem) => subItem.href === pathname
                    );
                    return (
                      <Collapsible key={i} defaultOpen={isSubItemActive}>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant={isSubItemActive ? 'secondary' : 'ghost'}
                            className="w-full justify-start"
                          >
                            {item.icon}
                            <span className="ml-2">{item.title}</span>
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="ml-4 space-y-1 pt-1">
                            {item.subItems.map((subItem, j) => (
                              <Button
                                key={j}
                                variant={
                                  pathname === subItem.href
                                    ? 'secondary'
                                    : 'ghost'
                                }
                                asChild
                                className="w-full justify-start pl-6"
                              >
                                <Link to={subItem.href}>{subItem.title}</Link>
                              </Button>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  }
                  return (
                    <Button
                      key={i}
                      variant={pathname === item.href ? 'secondary' : 'ghost'}
                      asChild
                      className="w-full justify-start"
                    >
                      <Link to={item.href}>
                        {item.icon}
                        <span className="ml-2">{item.title}</span>
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
        <Separator />
      </div>
    </aside>
  );
};

export default Sidebar;
