
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useProducts } from '@/context/ProductContext';
import { useToast } from '@/hooks/use-toast';
import ProductForm from './ProductForm';
import { Product } from '@/types';

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({ 
  open, 
  onOpenChange,
  product 
}) => {
  const { updateProduct } = useProducts();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsSubmitting(true);
      console.log('Updating product data:', data);
      
      await updateProduct(product.id, data);
      
      toast({
        title: "Product updated",
        description: "The product has been updated successfully",
        variant: "default",
      });
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating product:', error);
      
      let errorMessage = "An error occurred while updating the product";
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <ProductForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
            defaultValues={product}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
