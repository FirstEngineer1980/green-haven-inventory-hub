
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "manager" | "staff" | "viewer";
  avatar?: string;
  permissions?: string[];
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => Promise<void>;
  isSubmitting: boolean;
  isEdit: boolean;
  defaultValues?: Partial<UserFormData>;
}

const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  isSubmitting,
  isEdit,
  defaultValues
}) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      password: '',
      role: defaultValues?.role || 'staff',
      avatar: defaultValues?.avatar || '',
    }
  });

  const selectedRole = watch('role');

  const handleFormSubmit = async (data: any) => {
    await onSubmit({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      avatar: data.avatar,
      permissions: [],
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          {...register('name', { required: 'Name is required' })}
          placeholder="Enter full name"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          placeholder="Enter email address"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      {!isEdit && (
        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            {...register('password', { 
              required: !isEdit ? 'Password is required' : false,
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
            placeholder="Enter password"
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="role">Role *</Label>
        <Select value={selectedRole} onValueChange={(value) => setValue('role', value as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatar">Avatar URL</Label>
        <Input
          id="avatar"
          {...register('avatar')}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
