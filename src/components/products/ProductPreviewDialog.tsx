
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { Heart, BarChart2, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/context/FavoritesContext';
import { useComparison } from '@/context/ComparisonContext';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';

interface ProductPreviewDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductPreviewDialog: React.FC<ProductPreviewDialogProps> = ({ 
  product, 
  open, 
  onOpenChange 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToFavorites, isFavorite } = useFavorites();
  const { addToComparison, isInComparison } = useComparison();
  const { addToCart } = useCart();
  
  const handleAddToFavorites = () => {
    addToFavorites(product);
    toast({
      description: `${product.name} added to favorites`,
    });
  };
  
  const handleAddToComparison = () => {
    addToComparison(product);
    toast({
      description: `${product.name} added to comparison`,
    });
  };
  
  const handleAddToCart = () => {
    addToCart(product);
    toast({
      description: `${product.name} added to cart`,
    });
  };
  
  const handleViewDetails = () => {
    onOpenChange(false);
    setTimeout(() => {
      navigate(`/products/${product.id}`);
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quick Preview</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-md overflow-hidden">
            <img 
              src={product.image || 'https://placehold.co/400x400?text=No+Image'} 
              alt={product.name}
              className="w-full h-64 object-cover"
            />
          </div>
          
          <div>
            <div className="mb-2">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                {product.category}
              </span>
            </div>
            <h2 className="text-xl font-bold mb-2">{product.name}</h2>
            <p className="text-muted-foreground mb-4">{product.description}</p>
            
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              {product.costPrice > product.price && (
                <span className="text-lg line-through text-muted-foreground">
                  ${product.costPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Availability:</span>
                <span className={`text-sm font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">SKU:</span>
                <span className="text-sm font-medium">{product.sku}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className={isFavorite(product.id) ? "text-red-500" : ""}
                  onClick={handleAddToFavorites}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Button>
                <Button 
                  variant="outline"
                  className={isInComparison(product.id) ? "bg-muted" : ""}
                  onClick={handleAddToComparison}
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Compare
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="secondary" onClick={handleViewDetails}>
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPreviewDialog;
