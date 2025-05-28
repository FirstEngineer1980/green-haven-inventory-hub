
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { apiInstance } from '@/api/services/api';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileInfoTab } from '@/components/profile/ProfileInfoTab';
import { SecurityTab } from '@/components/profile/SecurityTab';

const Profile = () => {
  const { user: currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        position: currentUser.position || '',
      }));
    }
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      await apiInstance.put('/user/profile', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position
      });
      
      await updateUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation password must match.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      await apiInstance.put('/user/password', {
        current_password: formData.currentPassword,
        new_password: formData.newPassword
      });
      
      toast({
        title: "Password changed",
        description: "Your password has been successfully updated.",
      });
      
      setIsChangingPassword(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Password change failed",
        description: "There was an error changing your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const navigateToSettings = () => {
    navigate('/settings');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ProfileHeader onNavigateToSettings={navigateToSettings} />

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <ProfileInfoTab
              user={currentUser}
              formData={formData}
              isEditing={isEditing}
              loading={loading}
              onInputChange={handleInputChange}
              onSaveProfile={handleSaveProfile}
              onStartEdit={() => setIsEditing(true)}
              onCancelEdit={() => setIsEditing(false)}
            />
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <SecurityTab
              formData={formData}
              isChangingPassword={isChangingPassword}
              loading={loading}
              onInputChange={handleInputChange}
              onChangePassword={handleChangePassword}
              onStartPasswordChange={() => setIsChangingPassword(true)}
              onCancelPasswordChange={() => setIsChangingPassword(false)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
