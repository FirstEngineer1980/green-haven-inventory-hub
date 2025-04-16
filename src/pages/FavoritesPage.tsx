
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';

const FavoritesPage = () => {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
        
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-6">
            Items added to your favorites will appear here
          </p>
          <Button onClick={() => navigate('/products')}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Browse Products
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FavoritesPage;
