
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PurchaseOrder, Vendor, Product, PurchaseOrderItem } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash, Plus } from 'lucide-react';
import { 
  Card, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const poItemSchema = z.object({
  id: z.string().optional(),
  poId: z.string().optional(),
  productId: z.string(),
  productName: z.string(),
  quantity: z.coerce.number().positive(),
  unitPrice: z.coerce.number().positive(),
  total: z.coerce.number().optional(),
});

const purchaseOrderSchema = z.object({
  poNumber: z.string().min(1, { message: "PO number is required" }),
  vendorId: z.string().min(1, { message: "Vendor is required" }),
  vendorName: z.string().min(1, { message: "Vendor name is required" }),
  status: z.enum(["draft", "pending", "approved", "received", "cancelled"]),
  expectedDeliveryDate: z.string().optional().nullable(),
  notes: z.string().optional(),
  total: z.coerce.number().optional(),
  items: z.array(poItemSchema).min(1, { message: "At least one item is required" }),
});

type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>;

interface PurchaseOrderFormProps {
  onSubmit: (data: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>) => void;
  defaultValues: Partial<PurchaseOrderFormValues>;
  vendors: Vendor[];
  products: Product[];
  isEditing?: boolean;
}

export const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({
  onSubmit,
  defaultValues,
  vendors,
  products,
  isEditing = false
}) => {
  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      poNumber: defaultValues.poNumber || '',
      vendorId: defaultValues.vendorId || '',
      vendorName: defaultValues.vendorName || '',
      status: defaultValues.status || 'draft',
      expectedDeliveryDate: defaultValues.expectedDeliveryDate || null,
      notes: defaultValues.notes || '',
      total: defaultValues.total || 0,
      items: defaultValues.items || [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(
    vendors.find(v => v.id === defaultValues.vendorId) || null
  );

  useEffect(() => {
    if (selectedVendor) {
      form.setValue('vendorName', selectedVendor.name);
    }
  }, [selectedVendor, form]);

  // Recalculate totals when items change
  useEffect(() => {
    const items = form.watch('items');
    const itemsWithTotals = items.map(item => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const total = quantity * unitPrice;
      return { ...item, total };
    });
    
    form.setValue('items', itemsWithTotals);
    
    const total = itemsWithTotals.reduce((sum, item) => sum + (item.total || 0), 0);
    form.setValue('total', total);
  }, [form.watch('items')]);

  const addNewItem = () => {
    append({
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
    });
  };

  const handleSubmit = (data: PurchaseOrderFormValues) => {
    onSubmit(data as Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>);
  };

  const handleProductChange = (productId: string, index: number) => {
    const selectedProduct = products.find(p => p.id === productId);
    if (selectedProduct) {
      const items = form.getValues('items');
      items[index].productName = selectedProduct.name;
      items[index].unitPrice = selectedProduct.price;
      items[index].total = selectedProduct.price * (items[index].quantity || 1);
      form.setValue('items', items);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="poNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PO Number</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isEditing} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="vendorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    const vendor = vendors.find(v => v.id === value);
                    setSelectedVendor(vendor || null);
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vendor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    {isEditing && (
                      <>
                        <SelectItem value="received">Received</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="expectedDeliveryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Delivery Date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Order Items</h3>
          
          {fields.length === 0 ? (
            <div className="text-center p-4 border rounded-md bg-muted/50">
              <p>No items added to this purchase order</p>
              <Button type="button" variant="outline" onClick={addNewItem} className="mt-2">
                <Plus className="h-4 w-4 mr-2" /> Add First Item
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((item, index) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.productId`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-6">
                            <FormLabel>Product</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleProductChange(value, index);
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a product" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem key={product.id} value={product.id}>
                                    {product.name} ({product.sku})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                min={1} 
                                onChange={(e) => {
                                  field.onChange(e);
                                  const items = form.getValues('items');
                                  const quantity = Number(e.target.value) || 0;
                                  const unitPrice = items[index].unitPrice || 0;
                                  items[index].total = quantity * unitPrice;
                                  form.setValue('items', items);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Unit Price</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                type="number" 
                                step="0.01" 
                                min={0} 
                                onChange={(e) => {
                                  field.onChange(e);
                                  const items = form.getValues('items');
                                  const unitPrice = Number(e.target.value) || 0;
                                  const quantity = items[index].quantity || 0;
                                  items[index].total = quantity * unitPrice;
                                  form.setValue('items', items);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`items.${index}.total`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Total</FormLabel>
                            <FormControl>
                              <Input {...field} readOnly className="bg-muted" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      className="text-red-500"
                      onClick={() => remove(index)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              <Button type="button" variant="outline" onClick={addNewItem}>
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="flex justify-between items-center">
          <FormField
            control={form.control}
            name="total"
            render={({ field }) => (
              <div>
                <FormLabel className="text-lg">Order Total</FormLabel>
                <p className="text-2xl font-bold">${field.value?.toFixed(2) || '0.00'}</p>
              </div>
            )}
          />
          
          <Button type="submit" size="lg">
            {isEditing ? 'Update Purchase Order' : 'Create Purchase Order'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
