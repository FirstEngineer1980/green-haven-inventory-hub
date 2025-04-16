
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Home, ShoppingBag, ShoppingCart, Info, Phone, BadgePercent } from 'lucide-react';

const MainNav = () => {
  const navigate = useNavigate();

  return (
    <NavigationMenu className="max-w-full w-full justify-start">
      <NavigationMenuList className="space-x-2">
        {[
          { label: 'Home', path: '/', icon: <Home className="h-4 w-4 mr-2" /> },
          { label: 'Products', path: '/products', icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
          { label: 'Cart', path: '/cart', icon: <ShoppingCart className="h-4 w-4 mr-2" /> },
          { label: 'About', path: '/about', icon: <Info className="h-4 w-4 mr-2" /> },
          { label: 'Contact', path: '/contact', icon: <Phone className="h-4 w-4 mr-2" /> },
          { label: 'Promotions', path: '/promotions', icon: <BadgePercent className="h-4 w-4 mr-2" /> },
        ].map(({ label, path, icon }) => (
          <NavigationMenuItem key={path}>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "bg-transparent hover:bg-white/10 text-white cursor-pointer flex items-center"
              )}
              onClick={() => navigate(path)}
            >
              {icon}
              {label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNav;
