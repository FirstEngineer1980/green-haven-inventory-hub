
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CustomerProduct } from '@/context/CustomerProductContext';
import { useCustomers } from '@/context/CustomerContext';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SkuSelector from './SkuSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  qty: z.coerce.number().min(0, "Quantity must be 0 or greater"),
  name: z.string().min(1, "Name is required"),
  picture: z.string().optional(),
  description: z.string().optional(),
  customerId: z.string().min(1, "Customer is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CustomerProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: CustomerProduct;
  onSubmit: (values: FormValues) => void;
  title: string;
}

const CustomerProductForm: React.FC<CustomerProductFormProps> = ({
  open,
  onOpenChange,
  product,
  onSubmit,
  title,
}) => {
  const { customers } = useCustomers();
  const [selectedProductInfo, setSelectedProductInfo] = useState<any>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sku: '',
      qty: 0,
      name: '',
      picture: '',
      description: '',
      customerId: customers.length > 0 ? customers[0].id : '',
    },
  });
  
  // Reset form when dialog opens/closes or product changes
  useEffect(() => {
    if (open) {
      if (product) {
        // Edit mode - set form values from product
        form.reset({
          sku: product.sku,
          qty: product.qty,
          name: product.name,
          picture: product.picture || '',
          description: product.description || '',
          customerId: product.customerId,
        });
        setSelectedProductInfo(null);
      } else {
        // Add mode - reset to defaults
        form.reset({
          sku: '',
          qty: 0,
          name: '',
          picture: '',
          description: '',
          customerId: customers.length > 0 ? customers[0].id : '',
        });
        setSelectedProductInfo(null);
      }
    }
  }, [open, product, form, customers]);

  const handleProductSelect = (productInfo: any) => {
    setSelectedProductInfo(productInfo);
    // Auto-populate fields with product information
    form.setValue('name', productInfo.name);
    form.setValue('description', productInfo.description || '');
    form.setValue('picture', productInfo.image || '');
  };
  
  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <SkuSelector
                    value={field.value}
                    onValueChange={field.onChange}
                    onProductSelect={handleProductSelect}
                    placeholder="Select or enter SKU"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedProductInfo && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Product Information</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Price:</span> ${selectedProductInfo.price}
                    </div>
                    {selectedProductInfo.costPrice && (
                      <div>
                        <span className="font-medium">Cost:</span> ${selectedProductInfo.costPrice}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="qty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || (customers.length > 0 ? customers[0].id : undefined)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="picture"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Picture URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter picture URL (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter product description (optional)" 
                      {...field} 
                      className="resize-none"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerProductForm;
