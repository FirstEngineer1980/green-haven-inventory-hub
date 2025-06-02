
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Home,
  Package,
  Users,
  ShoppingCart,
  Truck,
  BarChart3,
  Settings,
  FileText,
  Grid3X3,
  Warehouse,
  Bell,
  UserPlus,
  TrendingUp,
  DollarSign,
  Receipt,
} from 'lucide-react';

const MainNav = () => {
  const location = useLocation();
  
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/customers', label: 'Customers', icon: Users },
    { href: '/customer-products', label: 'Customer Products', icon: Grid3X3 },
    { href: '/purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
    { href: '/vendors', label: 'Vendors', icon: Truck },
    { href: '/inventory', label: 'Inventory', icon: Warehouse },
    { href: '/invoices', label: 'Invoices', icon: Receipt },
  ];

  const crmItems = [
    { href: '/crm', label: 'CRM Dashboard', icon: BarChart3 },
    { href: '/crm/clients', label: 'Clients', icon: Users },
    { href: '/crm/sellers', label: 'Sellers', icon: UserPlus },
    { href: '/crm/seller-commissions', label: 'Seller Commissions', icon: TrendingUp },
    { href: '/crm/commission-dashboard', label: 'Commission Management', icon: DollarSign },
  ];

  const warehouseItems = [
    { href: '/rooms', label: 'Rooms', icon: Home },
    { href: '/units', label: 'Units', icon: Grid3X3 },
    { href: '/bins', label: 'Bins', icon: Package },
    { href: '/sku-matrix', label: 'SKU Matrix', icon: Grid3X3 },
    { href: '/unit-matrix', label: 'Unit Matrix', icon: Grid3X3 },
  ];

  const systemItems = [
    { href: '/users', label: 'Users', icon: Users },
    { href: '/reports', label: 'Reports', icon: BarChart3 },
    { href: '/notifications', label: 'Notifications', icon: Bell },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="space-y-2">
      {/* Main Navigation */}
      <div className="space-y-1">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Main
        </h3>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                location.pathname === item.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* CRM Section */}
      <div className="space-y-1">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          CRM & Sales
        </h3>
        {crmItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                location.pathname === item.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Warehouse Management */}
      <div className="space-y-1">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Warehouse
        </h3>
        {warehouseItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                location.pathname === item.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* System */}
      <div className="space-y-1">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          System
        </h3>
        {systemItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                location.pathname === item.href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MainNav;
