
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

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { addUser } = useUsers();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: Omit<User, 'id' | 'createdAt' | 'lastActive'>) => {
    try {
      setIsSubmitting(true);
      addUser(data);
      
      toast({
        title: "User added",
        description: "The user has been added successfully",
        variant: "default",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "An error occurred while adding the user",
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
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new user to the system.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <UserForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
