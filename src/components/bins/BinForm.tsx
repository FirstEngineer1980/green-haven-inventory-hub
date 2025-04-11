
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bin } from '@/types';
import { useUnitMatrix } from '@/context/UnitMatrixContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const binSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  length: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Length must be a positive number'),
  width: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Width must be a positive number'),
  height: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Height must be a positive number'),
  unitMatrixId: z.string().optional()
});

type BinFormValues = z.infer<typeof binSchema>;

interface BinFormProps {
  onSubmit: (data: Omit<Bin, 'id' | 'volumeCapacity' | 'unitMatrixName' | 'createdAt' | 'updatedAt'>) => void;
  defaultValues?: Partial<Bin>;
  isEditing?: boolean;
}

export const BinForm: React.FC<BinFormProps> = ({
  onSubmit,
  defaultValues = {},
  isEditing = false
}) => {
  const { unitMatrices } = useUnitMatrix();
  
  const form = useForm<BinFormValues>({
    resolver: zodResolver(binSchema),
    defaultValues: {
      name: defaultValues.name || '',
      length: defaultValues.length?.toString() || '',
      width: defaultValues.width?.toString() || '',
      height: defaultValues.height?.toString() || '',
      unitMatrixId: defaultValues.unitMatrixId || ''
    }
  });

  const handleSubmit = (values: BinFormValues) => {
    onSubmit({
      name: values.name,
      length: Number(values.length),
      width: Number(values.width),
      height: Number(values.height),
      unitMatrixId: values.unitMatrixId || undefined
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bin Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter bin name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Length (cm)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.1" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="width"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width (cm)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.1" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.1" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="unitMatrixId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Matrix (Optional)</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a unit matrix" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {unitMatrices.map((unitMatrix) => (
                    <SelectItem key={unitMatrix.id} value={unitMatrix.id}>
                      {unitMatrix.name} ({unitMatrix.roomName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">
          {isEditing ? 'Update Bin' : 'Add Bin'}
        </Button>
      </form>
    </Form>
  );
};
