
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/context/CategoryContext';
import { Product } from '@/types';

interface ProductFormProps {
  onSubmit: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isSubmitting: boolean;
  defaultValues?: Partial<Product>;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onSubmit,
  isSubmitting,
  defaultValues
}) => {
  const { categories } = useCategories();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: defaultValues?.name || '',
      sku: defaultValues?.sku || '',
      description: defaultValues?.description || '',
      category: defaultValues?.category || '',
      price: defaultValues?.price || 0,
      costPrice: defaultValues?.costPrice || 0,
      quantity: defaultValues?.quantity || 0,
      threshold: defaultValues?.threshold || 5,
      location: defaultValues?.location || '',
      image: defaultValues?.image || '',
    }
  });

  const selectedCategory = watch('category');

  const handleFormSubmit = async (data: any) => {
    await onSubmit({
      name: data.name,
      sku: data.sku,
      description: data.description,
      category: data.category,
      price: parseFloat(data.price),
      costPrice: parseFloat(data.costPrice),
      quantity: parseInt(data.quantity),
      threshold: parseInt(data.threshold),
      location: data.location,
      image: data.image,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            {...register('name', { required: 'Product name is required' })}
            placeholder="Enter product name"
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            {...register('sku', { required: 'SKU is required' })}
            placeholder="Enter SKU"
          />
          {errors.sku && <p className="text-sm text-red-500">{errors.sku.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Enter product description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={selectedCategory} onValueChange={(value) => setValue('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register('price', { required: 'Price is required', min: 0 })}
            placeholder="0.00"
          />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="costPrice">Cost Price *</Label>
          <Input
            id="costPrice"
            type="number"
            step="0.01"
            {...register('costPrice', { required: 'Cost price is required', min: 0 })}
            placeholder="0.00"
          />
          {errors.costPrice && <p className="text-sm text-red-500">{errors.costPrice.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input
            id="quantity"
            type="number"
            {...register('quantity', { required: 'Quantity is required', min: 0 })}
            placeholder="0"
          />
          {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="threshold">Low Stock Threshold *</Label>
          <Input
            id="threshold"
            type="number"
            {...register('threshold', { required: 'Threshold is required', min: 0 })}
            placeholder="5"
          />
          {errors.threshold && <p className="text-sm text-red-500">{errors.threshold.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          {...register('location')}
          placeholder="Storage location"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          {...register('image')}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
