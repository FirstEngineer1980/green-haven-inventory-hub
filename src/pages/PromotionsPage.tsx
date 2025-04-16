
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProducts } from '@/context/ProductContext';
import { Product } from '@/types';
import { Search, Tag, Percent } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import ProductPreviewDialog from '@/components/products/ProductPreviewDialog';
import { useNavigate } from 'react-router-dom';

// Mock promotions data
const mockPromotions = [
  {
    id: '1',
    title: 'Summer Sale',
    description: 'Save up to 40% on selected products',
    endDate: '2024-08-31',
    discount: 0.4,
    categories: ['Electronics', 'Office Supplies'],
    active: true,
    image: 'https://picsum.photos/seed/promo1/800/300'
  },
  {
    id: '2',
    title: 'Back to Office',
    description: '25% off on furniture and office supplies',
    endDate: '2024-09-15',
    discount: 0.25,
    categories: ['Furniture', 'Office Supplies'],
    active: true,
    image: 'https://picsum.photos/seed/promo2/800/300'
  },
  {
    id: '3',
    title: 'Flash Sale',
    description: 'Limited time offer - 30% off select electronics',
    endDate: '2024-07-20',
    discount: 0.3,
    categories: ['Electronics'],
    active: true,
    image: 'https://picsum.photos/seed/promo3/800/300'
  }
];

const PromotionsPage = () => {
  const { products, categories } = useProducts();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Get discounted products (mock implementation)
  const discountedProducts = products.map(product => {
    const randomPromotion = mockPromotions[Math.floor(Math.random() * mockPromotions.length)];
    const isDiscounted = Math.random() > 0.6;
    
    if (isDiscounted) {
      return {
        ...product,
        costPrice: product.price,
        price: parseFloat((product.price * (1 - randomPromotion.discount)).toFixed(2)),
        promotion: randomPromotion.id
      };
    }
    
    return product;
  }).filter(product => product.costPrice !== product.price);
  
  // Filter products
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(discountedProducts);
  
  useEffect(() => {
    let result = [...discountedProducts];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(product => 
        product.category === categoryFilter
      );
    }
    
    // Apply tab filter
    if (activeTab !== 'all') {
      const promotion = mockPromotions.find(promo => promo.id === activeTab);
      if (promotion) {
        result = result.filter(product => 
          product.promotion === promotion.id
        );
      }
    }
    
    setFilteredProducts(result);
  }, [searchTerm, categoryFilter, activeTab, discountedProducts]);
  
  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setShowPreview(true);
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Promotions & Deals</h1>
        
        {/* Promotions Banners */}
        <div className="mb-12 space-y-6">
          {mockPromotions.map(promotion => (
            <Card key={promotion.id} className="overflow-hidden">
              <div className="relative">
                <img 
                  src={promotion.image} 
                  alt={promotion.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                  <div className="pl-8 pr-4 py-4 text-white">
                    <h2 className="text-2xl font-bold mb-2">{promotion.title}</h2>
                    <p className="mb-4">{promotion.description}</p>
                    <div className="flex items-center space-x-2 mb-2">
                      <Tag className="h-4 w-4" />
                      <span>Categories: {promotion.categories.join(', ')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Percent className="h-4 w-4" />
                      <span>Discount: {promotion.discount * 100}%</span>
                    </div>
                    <Button 
                      className="mt-4" 
                      onClick={() => setActiveTab(promotion.id)}
                    >
                      Shop Now
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Filter Section */}
        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all">All Deals</TabsTrigger>
                {mockPromotions.map(promotion => (
                  <TabsTrigger key={promotion.id} value={promotion.id}>
                    {promotion.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <div className="flex gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search deals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="w-full md:w-40">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <TabsContent value="all">
              <ProductGrid 
                products={filteredProducts} 
                onQuickView={handleQuickView}
                onProductClick={(productId) => navigate(`/products/${productId}`)}
              />
            </TabsContent>
            
            {mockPromotions.map(promotion => (
              <TabsContent key={promotion.id} value={promotion.id}>
                <div className="mb-6">
                  <Card className="bg-muted">
                    <CardContent className="py-4">
                      <h2 className="text-xl font-semibold">{promotion.title}</h2>
                      <p className="text-muted-foreground">{promotion.description}</p>
                      <p className="text-sm mt-2">
                        <span className="font-medium">Valid until:</span> {new Date(promotion.endDate).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <ProductGrid 
                  products={filteredProducts.filter(p => p.promotion === promotion.id)} 
                  onQuickView={handleQuickView}
                  onProductClick={(productId) => navigate(`/products/${productId}`)}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      
      {selectedProduct && (
        <ProductPreviewDialog 
          product={selectedProduct}
          open={showPreview}
          onOpenChange={setShowPreview}
        />
      )}
    </DashboardLayout>
  );
};

interface ProductGridProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onProductClick: (productId: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onQuickView, onProductClick }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No promotional products found</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          viewMode="grid"
          onQuickView={onQuickView}
          onProductClick={() => onProductClick(product.id)}
        />
      ))}
    </div>
  );
};

export default PromotionsPage;
