
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { Heart, BarChart2, ShoppingCart, Truck, Shield, ArrowLeft, Star, StarHalf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/context/ProductContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useComparison } from '@/context/ComparisonContext';
import { useCart } from '@/context/CartContext';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { toast } = useToast();
  const { addToFavorites, isFavorite } = useFavorites();
  const { addToComparison, isInComparison } = useComparison();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(products.find(p => p.id === id));
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  useEffect(() => {
    // Find product data
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Get related products
      const related = products
        .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
        .slice(0, 4);
      setRelatedProducts(related);
    } else {
      navigate('/products');
    }
  }, [id, products, navigate]);
  
  if (!product) {
    return <div>Loading...</div>;
  }
  
  // Create a set of product images (including the main one)
  const productImages = [
    product.image || 'https://placehold.co/600x400?text=No+Image',
    'https://picsum.photos/seed/img1/600/400',
    'https://picsum.photos/seed/img2/600/400',
    'https://picsum.photos/seed/img3/600/400',
  ];
  
  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= product.quantity) {
      setQuantity(value);
    }
  };
  
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
    addToCart(product, quantity);
    toast({
      description: `${quantity} ${product.name} added to cart`,
    });
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/products')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Product Images */}
          <div>
            <div className="relative mb-4 rounded-lg overflow-hidden">
              <img
                src={productImages[activeImage]}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {productImages.map((img, index) => (
                <div 
                  key={index}
                  className={`
                    cursor-pointer rounded-md overflow-hidden border-2
                    ${activeImage === index ? 'border-primary' : 'border-transparent'}
                  `}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index}`}
                    className="w-full h-20 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div>
            <div className="space-y-6">
              <div>
                <div className="mb-2">
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {product.category}
                  </span>
                </div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center mt-1">
                  <div className="flex mr-2">
                    {[1, 2, 3, 4].map(i => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <StarHalf className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </div>
                  <span className="text-sm text-muted-foreground">(24 reviews)</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <span className="text-3xl font-bold mr-3">${product.price.toFixed(2)}</span>
                {product.costPrice > product.price && (
                  <span className="text-xl line-through text-muted-foreground">
                    ${product.costPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              <p className="text-muted-foreground">{product.description}</p>
              
              <div className="flex items-center justify-between py-4 border-y">
                <span className="font-medium">Availability:</span>
                <span className={`font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex space-x-4 items-center">
                  <div className="w-32">
                    <div className="flex border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-r-none h-10"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        className="h-10 text-center border-0"
                        min={1}
                        max={product.quantity}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-l-none h-10"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= product.quantity}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={product.quantity <= 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    className={isFavorite(product.id) ? "text-red-500" : ""}
                    onClick={handleAddToFavorites}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Add to Wishlist
                  </Button>
                  <Button 
                    variant="outline"
                    className={isInComparison(product.id) ? "bg-muted" : ""}
                    onClick={handleAddToComparison}
                  >
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Add to Compare
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm">2-year warranty included</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews (24)</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="text-muted-foreground">
            <p className="mb-4">
              {product.description}
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus, ipsum eu hendrerit consectetur, 
              elit risus pellentesque sapien, vel faucibus ex metus a felis. Cras ultrices tortor id est commodo, 
              in convallis justo convallis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere 
              cubilia curae; Sed fermentum nibh lorem, vitae rutrum mi pulvinar id.
            </p>
          </TabsContent>
          <TabsContent value="specifications">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-16">
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">SKU</span>
                  <span className="text-muted-foreground">{product.sku}</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">Weight</span>
                  <span className="text-muted-foreground">0.5 kg</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">Dimensions</span>
                  <span className="text-muted-foreground">10 × 10 × 10 cm</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">Color</span>
                  <span className="text-muted-foreground">Black, White</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">Material</span>
                  <span className="text-muted-foreground">Metal, Plastic</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="font-medium">Warranty</span>
                  <span className="text-muted-foreground">2 Years</span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="md:w-1/4">
                  <div className="text-center">
                    <div className="text-5xl font-bold">4.5</div>
                    <div className="flex justify-center my-2">
                      {[1, 2, 3, 4].map(i => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                      <StarHalf className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="text-sm text-muted-foreground">Based on 24 reviews</div>
                  </div>
                </div>
                
                <div className="md:w-3/4">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center">
                        <div className="w-10 text-right mr-2">{rating} ★</div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="bg-yellow-400 h-full rounded-full" 
                            style={{ 
                              width: `${rating === 5 ? 60 : rating === 4 ? 30 : rating === 3 ? 8 : rating === 2 ? 2 : 0}%` 
                            }} 
                          />
                        </div>
                        <div className="w-10 text-left ml-2">
                          {rating === 5 ? '60%' : rating === 4 ? '30%' : rating === 3 ? '8%' : rating === 2 ? '2%' : '0%'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-4">Write a Review</Button>
                </div>
              </div>
              
              <Separator />
              
              {/* Sample reviews */}
              {[1, 2, 3].map(i => (
                <div key={i} className="py-4">
                  <div className="flex justify-between mb-2">
                    <div>
                      <div className="font-semibold">John Doe</div>
                      <div className="text-xs text-muted-foreground">March 15, 2024</div>
                    </div>
                    <div className="flex">
                      {Array(5).fill(0).map((_, j) => (
                        <Star 
                          key={j} 
                          className={`h-4 w-4 ${j < (5 - i % 2) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus, ipsum eu hendrerit consectetur, 
                    elit risus pellentesque sapien, vel faucibus ex metus a felis.
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <Card 
                  key={relatedProduct.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/products/${relatedProduct.id}`)}
                >
                  <div className="h-48 relative">
                    <img
                      src={relatedProduct.image || 'https://placehold.co/300x200?text=No+Image'}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1">{relatedProduct.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">${relatedProduct.price.toFixed(2)}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            className={`h-3 w-3 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProductPage;
