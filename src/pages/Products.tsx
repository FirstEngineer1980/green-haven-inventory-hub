
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/context/ProductContext';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductTable from '@/components/products/ProductTable';
import AddProductDialog from '@/components/products/AddProductDialog';
import EditProductDialog from '@/components/products/EditProductDialog';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import ExportButton from '@/components/shared/ExportButton';
import ImportButton from '@/components/shared/ImportButton';
import { getTemplateUrl, validateTemplate } from '@/utils/templateGenerator';

const Products = () => {
  const { products, categories, addProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { toast } = useToast();
  
  const handleProductImport = (data: any[]) => {
    try {
      data.forEach(productData => {
        const product = {
          name: productData.name,
          sku: productData.sku,
          description: productData.description || '',
          category: productData.category,
          price: productData.price,
          costPrice: productData.costPrice,
          quantity: productData.quantity,
          threshold: productData.threshold,
          location: productData.location || '',
          image: productData.image || undefined
        };
        addProduct(product);
      });
      
      toast({
        title: "Products imported",
        description: `${data.length} products have been imported successfully`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error importing products:', error);
      toast({
        title: "Import failed",
        description: "An error occurred while importing products",
        variant: "destructive",
      });
    }
  };

  // Filter products by search term, category, and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex gap-2">
          <ImportButton 
            onImport={handleProductImport} 
            templateUrl={getTemplateUrl('products')}
            validationFn={(data) => validateTemplate(data, 'products')}
          />
          <ExportButton 
            data={products} 
            filename="products" 
            fields={['id', 'name', 'sku', 'description', 'category', 'price', 'costPrice', 'quantity', 'threshold', 'location', 'image', 'createdAt', 'updatedAt']}
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
          <ProductTable 
            products={filteredProducts}
            onEdit={(product) => {
              setSelectedProduct(product);
              setOpenEditDialog(true);
            }}
          />
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
