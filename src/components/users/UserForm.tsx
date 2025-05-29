
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@/types';

const userFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }).optional(),
  role: z.enum(['admin', 'manager', 'staff', 'viewer'] as const),
  permissions: z.array(z.string()).optional(),
  avatar: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  onSubmit: (data: UserFormValues) => void;
  defaultValues?: Partial<User>;
  isSubmitting: boolean;
  isEdit?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ 
  onSubmit, 
  defaultValues, 
  isSubmitting,
  isEdit = false
}) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      password: '',
      role: (defaultValues?.role === 'employee' ? 'staff' : defaultValues?.role) || 'viewer',
      permissions: defaultValues?.permissions || [],
      avatar: defaultValues?.avatar || '',
    },
  });

  const role = form.watch('role');

  // Default permissions for each role
  const getRolePermissions = (role: string): string[] => {
    switch (role) {
      case 'admin':
        return ['manage_users', 'manage_products', 'view_reports', 'manage_inventory', 'manage_notifications'];
      case 'manager':
        return ['manage_products', 'view_reports', 'manage_inventory'];
      case 'staff':
        return ['manage_products', 'manage_inventory'];
      case 'viewer':
        return ['view_reports'];
      default:
        return [];
    }
  };

  const defaultPermissions = getRolePermissions(role);

  // All possible permissions
  const allPermissions: string[] = ['manage_users', 'manage_products', 'view_reports', 'manage_inventory', 'manage_notifications'];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter user name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isEdit && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select 
                onValueChange={(value: string) => {
                  field.onChange(value);
                  
                  // When role changes, update permissions to the default for that role
                  const permissions = getRolePermissions(value);
                  form.setValue('permissions', permissions);
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL (optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/avatar.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <FormLabel>Permissions</FormLabel>
          <div className="grid gap-2 border rounded-md p-4">
            <p className="text-sm text-muted-foreground mb-2">
              Default permissions for {role} role are pre-selected:
            </p>
            {allPermissions.map((permission) => (
              <FormField
                key={permission}
                control={form.control}
                name="permissions"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={permission}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(permission) || defaultPermissions.includes(permission)}
                          onCheckedChange={(checked) => {
                            const updatedValue = checked
                              ? [...(field.value || []), permission]
                              : (field.value || []).filter(
                                  (value) => value !== permission
                                );
                            field.onChange(updatedValue);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        {permission
                          .split('_')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Saving...' : 'Save User'}
        </Button>
      </form>
    </Form>
  );
};

export default UserForm;
