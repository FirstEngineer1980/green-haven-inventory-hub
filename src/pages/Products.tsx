
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/context/ProductContext';
import { useCategories } from '@/context/CategoryContext';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductTable from '@/components/products/ProductTable';
import AddProductDialog from '@/components/products/AddProductDialog';
import EditProductDialog from '@/components/products/EditProductDialog';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import BackendExportButton from '@/components/shared/BackendExportButton';
import BackendImportButton from '@/components/shared/BackendImportButton';
import { useAuth } from '@/context/AuthContext';

const Products = () => {
  const { products, addProduct, loading, error, fetchProducts } = useProducts();
  const { categories, fetchCategories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [hasInitiallyFetched, setHasInitiallyFetched] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Fetch data when component mounts, but only once
  useEffect(() => {
    if (isAuthenticated && !hasInitiallyFetched) {
      console.log('Initial fetch of products and categories...');
      fetchProducts();
      fetchCategories();
      setHasInitiallyFetched(true);
    }
  }, [isAuthenticated, hasInitiallyFetched]);

  const handleImportSuccess = () => {
    // Refresh the products after import
    fetchProducts();
    toast({
      title: "Import successful",
      description: "Products have been imported and the list has been refreshed",
      variant: "default",
    });
  };

  // Filter products by search term, category, and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Error state handling
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error Loading Products</h1>
            <p className="text-muted-foreground mb-6">{typeof error === 'string' ? error : 'Failed to fetch product data. Please try again later.'}</p>
            <Button onClick={() => fetchProducts()}>Retry</Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const productFields = ['id', 'name', 'sku', 'description', 'category', 'price', 'costPrice', 'quantity', 'threshold', 'location', 'image', 'createdAt', 'updatedAt'];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex gap-2">
          <BackendImportButton 
            type="products"
            onSuccess={handleImportSuccess}
          />
          <BackendExportButton 
            type="products"
            availableFields={productFields}
          />
          <Button onClick={() => setOpenAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Product
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-64">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            Manage your product catalog and inventory levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="w-full py-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No products found</p>
              <Button onClick={() => setOpenAddDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <ProductTable 
              products={filteredProducts}
              onEdit={(product) => {
                setSelectedProduct(product);
                setOpenEditDialog(true);
              }}
            />
          )}
        </CardContent>
      </Card>

      <AddProductDialog open={openAddDialog} onOpenChange={setOpenAddDialog} />
      
      {selectedProduct && (
        <EditProductDialog 
          open={openEditDialog} 
          onOpenChange={setOpenEditDialog} 
          product={selectedProduct} 
        />
      )}
    </DashboardLayout>
  );
};

export default Products;
