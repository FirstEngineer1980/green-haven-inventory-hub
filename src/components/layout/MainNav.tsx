
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Home, ShoppingBag, ShoppingCart, Info, Phone, BadgePercent, Menu } from 'lucide-react';

const MainNav = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', path: '/', icon: <Home className="h-4 w-4 mr-2" /> },
    { label: 'Products', path: '/products', icon: <ShoppingBag className="h-4 w-4 mr-2" /> },
    { label: 'Cart', path: '/cart', icon: <ShoppingCart className="h-4 w-4 mr-2" /> },
    { label: 'About', path: '/about', icon: <Info className="h-4 w-4 mr-2" /> },
    { label: 'Contact', path: '/contact', icon: <Phone className="h-4 w-4 mr-2" /> },
    { label: 'Promotions', path: '/promotions', icon: <BadgePercent className="h-4 w-4 mr-2" /> },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  // Mobile navigation using Sheet component
  if (isMobile) {
    return (
      <div className="flex justify-between items-center w-full">
        <Button 
          variant="ghost" 
          className="p-2 text-white"
          onClick={() => navigate('/')}
        >
          <Home className="h-5 w-5" />
        </Button>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="p-2 text-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] pt-12">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="justify-start"
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // Desktop navigation
  return (
    <NavigationMenu className="max-w-full w-full justify-start">
      <NavigationMenuList className="space-x-2">
        {navItems.map(({ label, path, icon }) => (
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
