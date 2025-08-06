
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
  Heart
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Customer Products', href: '/customer-products', icon: UserCheck },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Purchase Orders', href: '/purchase-orders', icon: FileText },
  { name: 'Vendors', href: '/vendors', icon: Truck },
  { name: 'Categories', href: '/categories', icon: Grid3X3 },
  { name: 'Inventory', href: '/inventory', icon: Archive },
  
  // Warehouse section
  { name: 'Rooms', href: '/rooms', icon: Building },
  { name: 'Units', href: '/units', icon: Layers },
  { name: 'Bins', href: '/bins', icon: Box },
  { name: 'Stock Movements', href: '/stock-movements', icon: TrendingUp },
  
  // Matrix section
  { name: 'SKU Matrix', href: '/sku-matrix', icon: Grid3X3 },
  { name: 'Unit Matrix', href: '/unit-matrix', icon: Warehouse },
  
  // CRM section
  { name: 'CRM Dashboard', href: '/crm', icon: Heart },
  { name: 'Clients', href: '/crm/clients', icon: Users },
  { name: 'Sellers', href: '/crm/sellers', icon: UserCheck },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  
  // Shopify section
  { name: 'Shopify Orders', href: '/shopify/orders', icon: ExternalLink },
  { name: 'Shopify Customers', href: '/shopify/customers', icon: Users },
  
  // Settings section
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Users', href: '/users', icon: Shield },
  { name: 'Promotions', href: '/promotions', icon: TrendingUp },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    isActive
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-blue-500' : 'text-gray-400',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
