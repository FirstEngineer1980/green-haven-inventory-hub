
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useUsers } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import UserForm from './UserForm';
import { User } from '@/types';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

type UserFormData = {
  name: string;
  email: string;
  role: "admin" | "manager" | "staff" | "viewer";
  avatar?: string;
  permissions?: string[];
};

const EditUserDialog: React.FC<EditUserDialogProps> = ({ 
  open, 
  onOpenChange, 
  user 
}) => {
  const { updateUser } = useUsers();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      updateUser(user.id.toString(), {
        name: data.name,
        email: data.email,
        role: data.role,
        permissions: data.permissions || [],
        avatar: data.avatar
      });
      
      toast({
        title: "User updated",
        description: "The user has been updated successfully",
        variant: "default",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "An error occurred while updating the user",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert user role 'employee' to 'staff' for the form
  const formDefaultValues = {
    name: user.name,
    email: user.email,
    role: (user.role === 'employee' ? 'staff' : user.role) as "admin" | "manager" | "staff" | "viewer",
    permissions: user.permissions || [],
    avatar: user.avatar || '',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update the user details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <UserForm 
            onSubmit={handleSubmit} 
            defaultValues={formDefaultValues}
            isSubmitting={isSubmitting} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
