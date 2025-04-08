
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useProducts } from '@/context/ProductContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Product } from '@/types';

const Inventory = () => {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products based on search term and active tab
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => {
      if (activeTab === 'all') return true;
      if (activeTab === 'low-stock') return product.quantity <= product.threshold;
      if (activeTab === 'in-stock') return product.quantity > 0;
      if (activeTab === 'out-of-stock') return product.quantity === 0;
      return true;
    });

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0) return 'Out of Stock';
    if (product.quantity <= product.threshold) return 'Low Stock';
    return 'In Stock';
  };

  const getStockStatusColor = (product: Product) => {
    if (product.quantity === 0) return 'destructive';
    if (product.quantity <= product.threshold) return 'warning';
    return 'success';
  };

  return (
    <DashboardLayout requiredPermission="manage_inventory">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
          <div className="flex gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add New Product</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  {/* Add product form would go here */}
                  <p className="text-gray-500">Product creation form would be implemented here</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="in-stock">In Stock</TabsTrigger>
            <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
            <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>Products ({filteredProducts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          No products found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map(product => (
                        <TableRow key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.location}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell className="font-medium">{product.quantity}</TableCell>
                          <TableCell>
                            <Badge variant={getStockStatusColor(product) as any}>{getStockStatus(product)}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Details Sheet */}
      {selectedProduct && (
        <Sheet open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <SheetContent className="sm:max-w-xl">
            <SheetHeader>
              <SheetTitle>{selectedProduct.name}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">SKU</h4>
                  <p>{selectedProduct.sku}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Category</h4>
                  <p>{selectedProduct.category}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Location</h4>
                  <p>{selectedProduct.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Stock</h4>
                  <p>{selectedProduct.quantity} units</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Price</h4>
                  <p>${selectedProduct.price.toFixed(2)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Cost</h4>
                  <p>${selectedProduct.costPrice.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                <p className="text-sm">{selectedProduct.description}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">Edit Product</Button>
                <Button variant="secondary" className="flex-1">Adjust Stock</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </DashboardLayout>
  );
};

export default Inventory;
