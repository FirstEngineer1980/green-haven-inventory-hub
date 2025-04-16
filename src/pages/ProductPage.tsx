
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/context/ProductContext';
import { ArrowLeft, Heart, BarChart2, ShoppingCart, Scale } from 'lucide-react';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products } = useProducts();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate('/products');
    }
  }, [id, products, navigate]);
  
  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  const handleAddToFavorites = () => {
    toast({
      title: "Added to favorites",
      description: `${product.name} has been added to your favorites`,
    });
  };
  
  const handleAddToCompare = () => {
    toast({
      title: "Added to comparison",
      description: `${product.name} has been added to your comparison list`,
    });
  };
  
  if (!product) {
    return <div>Loading...</div>;
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/products')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="rounded-lg overflow-hidden border bg-background mb-4 h-96">
              <img 
                src={product.image || `https://picsum.photos/seed/${product.id}/800/800`} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <Badge className="mr-2">{product.category}</Badge>
              <span className="text-muted-foreground">SKU: {product.sku}</span>
            </div>
            
            <div className="text-2xl font-bold mb-6">${product.price.toFixed(2)}</div>
            
            <p className="text-muted-foreground mb-6">{product.description}</p>
            
            <div className="flex flex-col space-y-4 mb-8">
              <div className="flex space-x-4">
                <Button 
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAddToFavorites}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAddToCompare}
                >
                  <Scale className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Availability:</span>
                <span className={product.quantity > 0 ? "text-green-600" : "text-red-600"}>
                  {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Quantity:</span>
                <span>{product.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Category:</span>
                <span>{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Location:</span>
                <span>{product.location || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <Tabs defaultValue="details">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Product Details</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Product Description</h2>
                  <p className="text-muted-foreground">{product.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Technical Specifications</h2>
                  <p className="text-muted-foreground">Specifications are not available for this product.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
                  <p className="text-muted-foreground">No reviews yet.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductPage;
