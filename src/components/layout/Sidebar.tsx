
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Package,
  Users,
  ShoppingCart,
  Truck,
  Settings,
  Bell,
  BarChart3,
  FileText,
  Grid3X3,
  Warehouse,
  Box,
  Building,
  Layers,
  TrendingUp,
  Archive,
  UserCheck,
  ExternalLink,
  Shield,
  Heart,
  LayoutDashboard,
  Store,
  Database,
  Zap,
  CreditCard
} from 'lucide-react';

const navigationSections = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Sales & Orders',
    items: [
      { name: 'Orders', href: '/orders', icon: ShoppingCart },
      { name: 'Purchase Orders', href: '/purchase-orders', icon: FileText },
      { name: 'Customers', href: '/customers', icon: Users },
      { name: 'Customer Products', href: '/customer-products', icon: UserCheck },
      { name: 'Invoices', href: '/invoices', icon: CreditCard },
    ]
  },
  {
    title: 'Inventory Management',
    items: [
      { name: 'Products', href: '/products', icon: Package },
      { name: 'Categories', href: '/categories', icon: Grid3X3 },
      { name: 'Inventory', href: '/inventory', icon: Archive },
      { name: 'Vendors', href: '/vendors', icon: Truck },
    ]
  },
  {
    title: 'Warehouse Operations',
    items: [
      { name: 'Rooms', href: '/rooms', icon: Building },
      { name: 'Units', href: '/units', icon: Layers },
      { name: 'Bins', href: '/bins', icon: Box },
      { name: 'Stock Movements', href: '/stock-movements', icon: TrendingUp },
    ]
  },
  {
    title: 'Advanced Tools',
    items: [
      { name: 'SKU Matrix', href: '/sku-matrix', icon: Grid3X3 },
      { name: 'Unit Matrix', href: '/unit-matrix', icon: Warehouse },
      { name: 'Promotions', href: '/promotions', icon: Zap },
    ]
  },
  {
    title: 'CRM & Relations',
    items: [
      { name: 'CRM Dashboard', href: '/crm', icon: Heart },
      { name: 'Clients', href: '/crm/clients', icon: Users },
      { name: 'Sellers', href: '/crm/sellers', icon: UserCheck },
    ]
  },
  {
    title: 'E-commerce Integration',
    items: [
      { name: 'Shopify Orders', href: '/shopify/orders', icon: ExternalLink },
      { name: 'Shopify Customers', href: '/shopify/customers', icon: Store },
    ]
  },
  {
    title: 'System & Analytics',
    items: [
      { name: 'Reports', href: '/reports', icon: BarChart3 },
      { name: 'Users', href: '/users', icon: Shield },
      { name: 'Notifications', href: '/notifications', icon: Bell },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-background border-r border-border">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex flex-col flex-1 pt-6 pb-4 overflow-y-auto">
          <div className="px-4 mb-6">
            <h2 className="text-lg font-semibold text-foreground">Management System</h2>
          </div>
          
          <nav className="flex-1 px-3 space-y-6">
            {navigationSections.map((section) => (
              <div key={section.title}>
                <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'mr-3 flex-shrink-0 h-4 w-4',
                            isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
