
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Package } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  onQuickView?: (product: Product) => void;
  onProductClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  viewMode = 'grid', 
  onQuickView,
  onProductClick
}) => {
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent event bubbling from buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    onProductClick?.();
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView?.(product);
  };

  if (viewMode === 'list') {
    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.sku}</p>
                <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold text-lg">${product.price}</p>
                <Badge variant={product.quantity > product.threshold ? 'default' : 'destructive'}>
                  Stock: {product.quantity}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleQuickView}>
                <Eye className="h-4 w-4 mr-2" />
                Quick View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <CardHeader className="p-0">
        <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
          ) : (
            <Package className="h-16 w-16 text-gray-400" />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.sku}</p>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg">${product.price}</span>
            <Badge variant={product.quantity > product.threshold ? 'default' : 'destructive'}>
              Stock: {product.quantity}
            </Badge>
          </div>
          
          <div className="flex space-x-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={handleQuickView}>
              <Eye className="h-4 w-4 mr-2" />
              Quick View
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
