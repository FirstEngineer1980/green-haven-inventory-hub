
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react"
import { LayoutDashboard, LayoutGrid, Users, Package, ListChecks, DoorOpen, Table, ShoppingCart, Truck, Bell, Settings as SettingIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface SidebarProps {
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const Sidebar = () => {
  const { pathname } = useLocation();

  const linkClass =
    "flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-secondary hover:text-accent-foreground";
  const activeClass = "bg-secondary text-accent-foreground";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="p-0 px-2">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-6">
          <LayoutDashboard className="h-6 w-6" />
          <span className="text-lg font-bold">Inventory System</span>
        </Link>
        <nav className="space-y-2">
        <Link
            to="/dashboard"
            className={cn(linkClass, pathname === "/dashboard" && activeClass)}
          >
            <LayoutDashboard className="h-4 w-4 mr-2" />
            Dashboard
          </Link>
          <Link
            to="/products"
            className={cn(linkClass, pathname === "/products" && activeClass)}
          >
            <Package className="h-4 w-4 mr-2" />
            Products
          </Link>
          <Link
            to="/inventory"
            className={cn(linkClass, pathname === "/inventory" && activeClass)}
          >
            <ListChecks className="h-4 w-4 mr-2" />
            Inventory
          </Link>
          <Link
            to="/stock-movements"
            className={cn(linkClass, pathname === "/stock-movements" && activeClass)}
          >
            <Truck className="h-4 w-4 mr-2" />
            Stock Movements
          </Link>
          <Link
            to="/purchase-orders"
            className={cn(linkClass, pathname === "/purchase-orders" && activeClass)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Purchase Orders
          </Link>
          <Link
            to="/customers"
            className={cn(linkClass, pathname === "/customers" && activeClass)}
          >
            <Users className="h-4 w-4 mr-2" />
            Customers
          </Link>
          <Link to="/rooms" className={cn(linkClass, pathname === '/rooms' && activeClass)}>
            <DoorOpen className="h-4 w-4 mr-2" />
            Rooms
          </Link>
          <Link to="/units" className={cn(linkClass, pathname === '/units' && activeClass)}>
            <LayoutGrid className="h-4 w-4 mr-2" />
            Units
          </Link>
          <Link to="/unit-matrix" className={cn(linkClass, pathname === '/unit-matrix' && activeClass)}>
            <Table className="h-4 w-4 mr-2" />
            Unit Matrix
          </Link>
          <Link
            to="/notifications"
            className={cn(linkClass, pathname === "/notifications" && activeClass)}
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Link>
          <Link
            to="/settings"
            className={cn(linkClass, pathname === "/settings" && activeClass)}
          >
            <SettingIcon className="h-4 w-4 mr-2" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
