
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PasswordChangeForm } from './PasswordChangeForm';
import { LoginActivity } from './LoginActivity';

interface SecurityTabProps {
  formData: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  isChangingPassword: boolean;
  loading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: () => void;
  onStartPasswordChange: () => void;
  onCancelPasswordChange: () => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({
  formData,
  isChangingPassword,
  loading,
  onInputChange,
  onChangePassword,
  onStartPasswordChange,
  onCancelPasswordChange
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            {isChangingPassword
              ? "Enter your current password and choose a new one"
              : "Change your password to keep your account secure"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isChangingPassword ? (
            <PasswordChangeForm
              formData={formData}
              onInputChange={onInputChange}
              onSubmit={onChangePassword}
              onCancel={onCancelPasswordChange}
              loading={loading}
            />
          ) : (
            <div>
              <p className="text-sm mb-4">
                It's a good idea to use a strong password that you don't use elsewhere.
              </p>
              <Button onClick={onStartPasswordChange}>
                Change Password
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <LoginActivity />
    </div>
  );
};
