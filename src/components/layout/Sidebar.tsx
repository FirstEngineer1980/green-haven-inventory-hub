import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { BarChart3, Box, Boxes, ChevronDown, ChevronRight, CircleDollarSign, ClipboardList, CreditCard, FolderOpen, Heart, Home, LayoutList, Menu, Package, PanelLeft, Percent, ShoppingBag, ShoppingCart, Tag, Truck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  return (
    <div className={cn("pb-12", className)}>
      <div className="py-4 hidden lg:block">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold">Dashboard</h2>
          <div className="space-y-1">
            <SidebarItem 
              Icon={Home} 
              label="Dashboard" 
              href="/dashboard" 
              isActive={location.pathname === '/dashboard'} 
            />
          </div>
        </div>
        <SidebarCategory title="E-commerce">
          <SidebarItem 
            Icon={ShoppingBag} 
            label="Products" 
            href="/products" 
            isActive={location.pathname.startsWith('/products')} 
          />
          <SidebarItem 
            Icon={Tag} 
            label="Categories" 
            href="/categories" 
            isActive={location.pathname === '/categories'} 
          />
          <SidebarItem 
            Icon={Heart} 
            label="Favorites" 
            href="/favorites" 
            isActive={location.pathname === '/favorites'} 
          />
          <SidebarItem 
            Icon={ShoppingCart} 
            label="Shopping Cart" 
            href="/cart" 
            isActive={location.pathname === '/cart'} 
          />
          <SidebarItem 
            Icon={CreditCard} 
            label="Checkout" 
            href="/checkout" 
            isActive={location.pathname === '/checkout'} 
          />
          <SidebarItem 
            Icon={Percent} 
            label="Promotions" 
            href="/promotions" 
            isActive={location.pathname === '/promotions'} 
          />
          <SidebarItem 
            Icon={ClipboardList} 
            label="Orders" 
            href="/orders" 
            isActive={location.pathname.startsWith('/orders')} 
          />
        </SidebarCategory>
        <SidebarCategory title="Customers">
          <SidebarItem 
            Icon={Users} 
            label="Customers" 
            href="/customers" 
            isActive={location.pathname === '/customers'} 
          />
          <SidebarItem 
            Icon={Package} 
            label="Customer Products" 
            href="/customer-products" 
            isActive={location.pathname === '/customer-products'} 
          />
          <SidebarItem 
            Icon={LayoutList} 
            label="Customer Lists" 
            href="/customer-list" 
            isActive={location.pathname === '/customer-list'} 
          />
        </SidebarCategory>
        <SidebarCategory title="Inventory">
          <SidebarItem 
            Icon={Box} 
            label="Inventory" 
            href="/inventory" 
            isActive={location.pathname === '/inventory'} 
          />
          <SidebarItem 
            Icon={CircleDollarSign} 
            label="Purchase Orders" 
            href="/purchase-orders" 
            isActive={location.pathname === '/purchase-orders'} 
          />
          <SidebarItem 
            Icon={Users} 
            label="Vendors" 
            href="/vendors" 
            isActive={location.pathname === '/vendors'} 
          />
          <SidebarItem 
            Icon={Truck} 
            label="Stock Movements" 
            href="/stock-movements" 
            isActive={location.pathname === '/stock-movements'} 
          />
        </SidebarCategory>
        <SidebarCategory title="Organization">
          <SidebarItem 
            Icon={FolderOpen} 
            label="Rooms" 
            href="/rooms" 
            isActive={location.pathname === '/rooms'} 
          />
          <SidebarItem 
            Icon={Boxes} 
            label="Units" 
            href="/units" 
            isActive={location.pathname === '/units'} 
          />
          <SidebarItem 
            Icon={Box} 
            label="Bins" 
            href="/bins" 
            isActive={location.pathname === '/bins'} 
          />
          <SidebarItem 
            Icon={LayoutList} 
            label="SKU Matrix" 
            href="/sku-matrix" 
            isActive={location.pathname === '/sku-matrix'} 
          />
        </SidebarCategory>
        {currentUser?.permissions.includes('manage_users') && (
          <SidebarCategory title="Administration">
            <SidebarItem 
              Icon={Users} 
              label="Users" 
              href="/users" 
              isActive={location.pathname === '/users'} 
            />
            <SidebarItem 
              Icon={BarChart3} 
              label="Reports" 
              href="/reports" 
              isActive={location.pathname === '/reports'} 
            />
          </SidebarCategory>
        )}
      </div>
      <div className="lg:hidden">
        <MobileSidebar />
      </div>
    </div>
  );
}

const SidebarCategory = ({ 
  title, 
  children 
}: { 
  title: string, 
  children: React.ReactNode 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="px-4 py-2">
      <div 
        className="mb-2 flex items-center justify-between px-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className={cn("space-y-1 transition-all duration-300", 
                         isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden")}>
        {children}
      </div>
    </div>
  );
};

const SidebarItem = ({ 
  Icon, 
  label, 
  href, 
  isActive 
}: { 
  Icon: React.ElementType, 
  label: string, 
  href: string, 
  isActive: boolean 
}) => {
  return (
    <Link 
      to={href}
      className={cn(
        "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
        isActive ? "bg-accent text-accent-foreground" : "transparent"
      )}
    >
      <Icon className="mr-2 h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
};

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="absolute left-4 top-4">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] p-0">
        <ScrollArea className="h-full px-1">
          <div className="p-4">
            <SheetClose asChild>
              <Link to="/" className="flex items-center gap-2">
                <PanelLeft className="h-5 w-5" />
                <span className="font-semibold">GreenHaven</span>
              </Link>
            </SheetClose>
          </div>
          <MobileSidebarContent />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

const MobileSidebarContent = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  return (
    <div className="pb-12">
      <div className="py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold">Dashboard</h2>
          <div className="space-y-1">
            <SidebarItem 
              Icon={Home} 
              label="Dashboard" 
              href="/dashboard" 
              isActive={location.pathname === '/dashboard'} 
            />
          </div>
        </div>
        <SidebarCategory title="E-commerce">
          <SidebarItem 
            Icon={ShoppingBag} 
            label="Products" 
            href="/products" 
            isActive={location.pathname.startsWith('/products')} 
          />
          <SidebarItem 
            Icon={Tag} 
            label="Categories" 
            href="/categories" 
            isActive={location.pathname === '/categories'} 
          />
          <SidebarItem 
            Icon={Heart} 
            label="Favorites" 
            href="/favorites" 
            isActive={location.pathname === '/favorites'} 
          />
          <SidebarItem 
            Icon={ShoppingCart} 
            label="Shopping Cart" 
            href="/cart" 
            isActive={location.pathname === '/cart'} 
          />
          <SidebarItem 
            Icon={CreditCard} 
            label="Checkout" 
            href="/checkout" 
            isActive={location.pathname === '/checkout'} 
          />
          <SidebarItem 
            Icon={Percent} 
            label="Promotions" 
            href="/promotions" 
            isActive={location.pathname === '/promotions'} 
          />
          <SidebarItem 
            Icon={ClipboardList} 
            label="Orders" 
            href="/orders" 
            isActive={location.pathname.startsWith('/orders')} 
          />
        </SidebarCategory>
        <SidebarCategory title="Customers">
          <SidebarItem 
            Icon={Users} 
            label="Customers" 
            href="/customers" 
            isActive={location.pathname === '/customers'} 
          />
          <SidebarItem 
            Icon={Package} 
            label="Customer Products" 
            href="/customer-products" 
            isActive={location.pathname === '/customer-products'} 
          />
          <SidebarItem 
            Icon={LayoutList} 
            label="Customer Lists" 
            href="/customer-list" 
            isActive={location.pathname === '/customer-list'} 
          />
        </SidebarCategory>
        <SidebarCategory title="Inventory">
          <SidebarItem 
            Icon={Box} 
            label="Inventory" 
            href="/inventory" 
            isActive={location.pathname === '/inventory'} 
          />
          <SidebarItem 
            Icon={CircleDollarSign} 
            label="Purchase Orders" 
            href="/purchase-orders" 
            isActive={location.pathname === '/purchase-orders'} 
          />
          <SidebarItem 
            Icon={Users} 
            label="Vendors" 
            href="/vendors" 
            isActive={location.pathname === '/vendors'} 
          />
          <SidebarItem 
            Icon={Truck} 
            label="Stock Movements" 
            href="/stock-movements" 
            isActive={location.pathname === '/stock-movements'} 
          />
        </SidebarCategory>
        <SidebarCategory title="Organization">
          <SidebarItem 
            Icon={FolderOpen} 
            label="Rooms" 
            href="/rooms" 
            isActive={location.pathname === '/rooms'} 
          />
          <SidebarItem 
            Icon={Boxes} 
            label="Units" 
            href="/units" 
            isActive={location.pathname === '/units'} 
          />
          <SidebarItem 
            Icon={Box} 
            label="Bins" 
            href="/bins" 
            isActive={location.pathname === '/bins'} 
          />
          <SidebarItem 
            Icon={LayoutList} 
            label="SKU Matrix" 
            href="/sku-matrix" 
            isActive={location.pathname === '/sku-matrix'} 
          />
        </SidebarCategory>
        {currentUser?.permissions.includes('manage_users') && (
          <SidebarCategory title="Administration">
            <SidebarItem 
              Icon={Users} 
              label="Users" 
              href="/users" 
              isActive={location.pathname === '/users'} 
            />
            <SidebarItem 
              Icon={BarChart3} 
              label="Reports" 
              href="/reports" 
              isActive={location.pathname === '/reports'} 
            />
          </SidebarCategory>
        )}
      </div>
    </div>
  );
};
