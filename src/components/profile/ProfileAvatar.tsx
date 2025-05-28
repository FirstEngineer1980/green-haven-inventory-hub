
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User } from '@/types';

interface ProfileAvatarProps {
  user: User | null;
  isEditing: boolean;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ user, isEditing }) => {
  return (
    <div className="flex flex-col items-center gap-4 md:w-1/3">
      <Avatar className="h-24 w-24">
        {user?.avatar ? (
          <AvatarImage src={user.avatar} alt={user.name} />
        ) : (
          <AvatarFallback className="text-2xl bg-gh-blue text-white">
            {user?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        )}
      </Avatar>
      {isEditing && (
        <Button variant="outline" size="sm">
          Change Picture
        </Button>
      )}
      <div className="text-center">
        <h3 className="font-medium text-lg">{user?.name}</h3>
        <p className="text-sm text-muted-foreground">{user?.role}</p>
      </div>
    </div>
  );
};
