
import React from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@/types';

interface ProfileDisplayProps {
  user: User | null;
  onEdit: () => void;
}

export const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ user, onEdit }) => {
  return (
    <div className="md:w-2/3 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Full Name</p>
          <p className="text-base">{user?.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Email</p>
          <p className="text-base">{user?.email}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
          <p className="text-base">{user?.phone || "Not provided"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Position</p>
          <p className="text-base">{user?.position || "Not provided"}</p>
        </div>
      </div>
      
      <div className="pt-4">
        <Button onClick={onEdit}>
          Edit Profile
        </Button>
      </div>
    </div>
  );
};
