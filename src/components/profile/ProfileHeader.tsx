
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
  onNavigateToSettings: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ onNavigateToSettings }) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
      <Button variant="outline" onClick={onNavigateToSettings}>Settings</Button>
    </div>
  );
};
