
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFavorites } from '@/context/FavoritesContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Heart, ShoppingBag, Trash, ShoppingCart } from 'lucide-react';

const FavoritesPage = () => {
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromFavorites(productId);
    toast({
      description: `${productName} has been removed from your wishlist`,
    });
  };
  
  const handleAddToCart = (productId: string, productName: string) => {
    const product = favorites.find(item => item.id === productId);
    if (product) {
      addToCart(product);
      toast({
        description: `${productName} has been added to your cart`,
      });
    }
  };
  
  const handleClearWishlist = () => {
    clearFavorites();
    toast({
      description: "Your wishlist has been cleared",
    });
  };
  
  const handleContinueShopping = () => {
    navigate('/products');
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">My Wishlist</h1>
          {favorites.length > 0 && (
            <Button variant="outline" onClick={handleClearWishlist}>
              Clear Wishlist
            </Button>
          )}
        </div>
        
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save items you like in your wishlist and revisit them later.
            </p>
            <Button size="lg" onClick={handleContinueShopping}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map(product => (
              <Card key={product.id} className="overflow-hidden">
                <div 
                  className="h-48 relative cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <img 
                    src={product.image || 'https://placehold.co/300x200?text=No+Image'} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <Button 
                    variant="destructive" 
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveItem(product.id, product.name);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 
                    className="font-semibold mb-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">${product.price.toFixed(2)}</span>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product.id, product.name)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FavoritesPage;
