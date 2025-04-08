
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Package, Users, Bell, BarChart3, Settings, Warehouse, 
  LogOut, ShoppingCart, User, FileText, FolderDot, FolderOpen
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

const Sidebar = () => {
  const { currentUser, logout, hasPermission } = useAuth();

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-gh-green to-gh-blue w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
            GH
          </div>
          <div>
            <h1 className="text-lg font-bold">Green Haven</h1>
            <p className="text-xs text-gray-500">Inventory Hub</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="mr-3">
            <div className="w-10 h-10 rounded-full bg-gh-green text-white flex items-center justify-center overflow-hidden">
              {currentUser?.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <span>{currentUser?.name.charAt(0)}</span>
              )}
            </div>
          </div>
          <div>
            <div className="font-medium">{currentUser?.name}</div>
            <div className="text-xs text-gray-500">{currentUser?.role}</div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavLink to="/dashboard" className={({ isActive }) => cn("gh-nav-item", isActive && "active")}>
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/products" className={({ isActive }) => cn("gh-nav-item", isActive && "active")}>
          <Package className="w-5 h-5" />
          <span>Products</span>
        </NavLink>
        
        <NavLink to="/inventory" className={({ isActive }) => cn("gh-nav-item", isActive && "active")}>
          <Warehouse className="w-5 h-5" />
          <span>Inventory</span>
        </NavLink>
        
        <NavLink to="/stock-movements" className={({ isActive }) => cn("gh-nav-item", isActive && "active")}>
          <ShoppingCart className="w-5 h-5" />
          <span>Stock Movements</span>
        </NavLink>
        
        {/* Updated Customer section with dropdown */}
        <div className="py-2">
          <NavigationMenu orientation="vertical" className="w-full max-w-none">
            <NavigationMenuList className="w-full flex-col items-start space-y-0">
              <NavigationMenuItem className="w-full">
                <NavigationMenuTrigger className="gh-nav-item w-full justify-between">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    <span>Customers</span>
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-full">
                  <ul className="w-full">
                    <li>
                      <NavigationMenuLink asChild>
                        <NavLink 
                          to="/customers" 
                          className={({ isActive }) => 
                            cn("block px-4 py-2 hover:bg-gray-100", 
                            isActive && "bg-gray-100 font-medium")
                          }
                        >
                          Customer List
                        </NavLink>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <NavLink 
                          to="/rooms" 
                          className={({ isActive }) => 
                            cn("block px-4 py-2 hover:bg-gray-100", 
                            isActive && "bg-gray-100 font-medium")
                          }
                        >
                          Customer Rooms
                        </NavLink>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Direct Rooms link - Alternative approach */}
        <NavLink to="/rooms" className={({ isActive }) => cn("gh-nav-item", isActive && "active")}>
          <FolderDot className="w-5 h-5" />
          <span>Rooms</span>
        </NavLink>
        
        {hasPermission('view_reports') && (
          <NavLink to="/reports" className={({ isActive }) => cn("gh-nav-item", isActive && "active")}>
            <FileText className="w-5 h-5" />
            <span>Reports</span>
          </NavLink>
        )}
        
        {hasPermission('manage_users') && (
          <NavLink to="/users" className={({ isActive }) => cn("gh-nav-item", isActive && "active")}>
            <Users className="w-5 h-5" />
            <span>Users</span>
          </NavLink>
        )}
        
        <NavLink to="/notifications" className={({ isActive }) => cn("gh-nav-item", isActive && "active")}>
          <Bell className="w-5 h-5" />
          <span>Notifications</span>
        </NavLink>
        
        <NavLink to="/settings" className={({ isActive }) => cn("gh-nav-item", isActive && "active")}>
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={logout}
          className="gh-nav-item w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
