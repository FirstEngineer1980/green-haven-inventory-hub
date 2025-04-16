
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { Eye, Heart, BarChart2, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/context/FavoritesContext';
import { useComparison } from '@/context/ComparisonContext';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onQuickView: (product: Product) => void;
  onProductClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  viewMode, 
  onQuickView,
  onProductClick
}) => {
  const { toast } = useToast();
  const { addToFavorites, isFavorite } = useFavorites();
  const { addToComparison, isInComparison } = useComparison();
  const { addToCart } = useCart();
  
  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToFavorites(product);
    toast({
      description: `${product.name} added to favorites`,
    });
  };
  
  const handleAddToComparison = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToComparison(product);
    toast({
      description: `${product.name} added to comparison`,
    });
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    toast({
      description: `${product.name} added to cart`,
    });
  };
  
  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(product);
  };

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onProductClick}>
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-48 h-48 relative">
            <img 
              src={product.image || 'https://placehold.co/200x200?text=No+Image'} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="mb-2">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                {product.category}
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
            <p className="text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={isFavorite(product.id) ? "text-red-500" : ""}
                  onClick={handleAddToFavorites}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className={isInComparison(product.id) ? "bg-muted" : ""}
                  onClick={handleAddToComparison}
                >
                  <BarChart2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleQuickView}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onProductClick}>
      <div className="relative h-48">
        <img 
          src={product.image || 'https://placehold.co/300x200?text=No+Image'} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className={`bg-white/80 ${isFavorite(product.id) ? "text-red-500" : ""}`}
            onClick={handleAddToFavorites}
          >
            <Heart className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className={`bg-white/80 ${isInComparison(product.id) ? "bg-muted" : ""}`}
            onClick={handleAddToComparison}
          >
            <BarChart2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white/80"
            onClick={handleQuickView}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
            {product.category}
          </span>
        </div>
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-2 h-10">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
        <Button size="sm" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
