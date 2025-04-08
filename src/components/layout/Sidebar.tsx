
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, Package, Users, Bell, BarChart3, Settings, Warehouse, 
  LogOut, ShoppingCart, User, FileText
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

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
        
        <NavLink to="/customers" className={({ isActive }) => cn("gh-nav-item", isActive && "active")}>
          <User className="w-5 h-5" />
          <span>Customers</span>
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
