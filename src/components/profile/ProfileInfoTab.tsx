
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileAvatar } from './ProfileAvatar';
import { ProfileForm } from './ProfileForm';
import { ProfileDisplay } from './ProfileDisplay';
import { User } from '@/types';

interface ProfileInfoTabProps {
  user: User | null;
  formData: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  isEditing: boolean;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveProfile: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
}

export const ProfileInfoTab: React.FC<ProfileInfoTabProps> = ({
  user,
  formData,
  isEditing,
  loading,
  onInputChange,
  onSaveProfile,
  onStartEdit,
  onCancelEdit
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>
          {isEditing 
            ? "Edit your personal information"
            : "View and manage your personal information"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <ProfileAvatar user={user} isEditing={isEditing} />
          
          {isEditing ? (
            <ProfileForm
              formData={formData}
              onInputChange={onInputChange}
              onSave={onSaveProfile}
              onCancel={onCancelEdit}
              loading={loading}
            />
          ) : (
            <ProfileDisplay user={user} onEdit={onStartEdit} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
