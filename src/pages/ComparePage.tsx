
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useComparison } from '@/context/ComparisonContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, BarChart2, Trash, ShoppingCart, Check, X } from 'lucide-react';

const ComparePage = () => {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromComparison(productId);
    toast({
      description: `${productName} has been removed from comparison`,
    });
  };
  
  const handleAddToCart = (productId: string, productName: string) => {
    const product = comparisonList.find(item => item.id === productId);
    if (product) {
      addToCart(product);
      toast({
        description: `${productName} has been added to your cart`,
      });
    }
  };
  
  const handleClearComparison = () => {
    clearComparison();
    toast({
      description: "Comparison has been cleared",
    });
  };
  
  const handleGoBack = () => {
    navigate('/products');
  };
  
  // Define comparison features
  const features = [
    { name: 'Price', key: 'price', format: (value: number) => `$${value.toFixed(2)}` },
    { name: 'Category', key: 'category' },
    { name: 'In Stock', key: 'quantity', format: (value: number) => value > 0 ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" /> },
    { name: 'SKU', key: 'sku' },
  ];
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Compare Products</h1>
          {comparisonList.length > 0 && (
            <Button variant="outline" onClick={handleClearComparison}>
              Clear Comparison
            </Button>
          )}
        </div>
        
        {comparisonList.length === 0 ? (
          <div className="text-center py-16">
            <BarChart2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No products to compare</h2>
            <p className="text-muted-foreground mb-6">
              Add products to compare their features and specifications.
            </p>
            <Button size="lg" onClick={handleGoBack}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-muted">
                  <th className="p-4 text-left w-40">Feature</th>
                  {comparisonList.map(product => (
                    <th key={product.id} className="p-4 text-center">
                      <div className="relative">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-destructive text-white hover:bg-destructive/90"
                          onClick={() => handleRemoveItem(product.id, product.name)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Product Images */}
                <tr>
                  <td className="p-4 border-t border-b bg-muted font-medium">Image</td>
                  {comparisonList.map(product => (
                    <td key={product.id} className="p-4 border-t border-b text-center">
                      <div className="w-40 h-40 mx-auto">
                        <img 
                          src={product.image || 'https://placehold.co/200x200?text=No+Image'} 
                          alt={product.name}
                          className="w-full h-full object-contain cursor-pointer"
                          onClick={() => navigate(`/products/${product.id}`)}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Product Names */}
                <tr>
                  <td className="p-4 border-t border-b bg-muted font-medium">Name</td>
                  {comparisonList.map(product => (
                    <td key={product.id} className="p-4 border-t border-b text-center">
                      <h3 
                        className="font-semibold text-lg cursor-pointer hover:text-primary transition-colors"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        {product.name}
                      </h3>
                    </td>
                  ))}
                </tr>
                
                {/* Product Features */}
                {features.map(feature => (
                  <tr key={feature.name}>
                    <td className="p-4 border-t border-b bg-muted font-medium">{feature.name}</td>
                    {comparisonList.map(product => {
                      const value = product[feature.key as keyof typeof product];
                      return (
                        <td key={product.id} className="p-4 border-t border-b text-center">
                          {feature.format ? feature.format(value as any) : value as string}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                
                {/* Description */}
                <tr>
                  <td className="p-4 border-t border-b bg-muted font-medium">Description</td>
                  {comparisonList.map(product => (
                    <td key={product.id} className="p-4 border-t border-b text-center">
                      <p className="text-sm text-muted-foreground">{product.description}</p>
                    </td>
                  ))}
                </tr>
                
                {/* Action buttons */}
                <tr>
                  <td className="p-4 border-t border-b bg-muted font-medium">Actions</td>
                  {comparisonList.map(product => (
                    <td key={product.id} className="p-4 border-t border-b text-center">
                      <Button
                        className="w-full mb-2"
                        onClick={() => handleAddToCart(product.id, product.name)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        View Details
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ComparePage;
