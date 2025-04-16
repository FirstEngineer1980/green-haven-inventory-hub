
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    position: currentUser?.position || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      // Call API to update user profile
      await updateUser(formData);
      
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
    
    try {
      // Call API to change password
      await updateUser({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
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
    }
  };

  const navigateToSettings = () => {
    navigate('/settings');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
          <Button variant="outline" onClick={navigateToSettings}>Settings</Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
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
                  <div className="flex flex-col items-center gap-4 md:w-1/3">
                    <Avatar className="h-24 w-24">
                      {currentUser?.avatar ? (
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                      ) : (
                        <AvatarFallback className="text-2xl bg-gh-blue text-white">
                          {currentUser?.name.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        Change Picture
                      </Button>
                    )}
                    <div className="text-center">
                      <h3 className="font-medium text-lg">{currentUser?.name}</h3>
                      <p className="text-sm text-muted-foreground">{currentUser?.role}</p>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 space-y-4">
                    {isEditing ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input 
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="position">Position</Label>
                            <Input 
                              id="position"
                              name="position"
                              value={formData.position}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-2 justify-end mt-4">
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveProfile}>
                            Save Changes
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                            <p className="text-base">{currentUser?.name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                            <p className="text-base">{currentUser?.email}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                            <p className="text-base">{currentUser?.phone || "Not provided"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Position</p>
                            <p className="text-base">{currentUser?.position || "Not provided"}</p>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <Button onClick={() => setIsEditing(true)}>
                            Edit Profile
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
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
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input 
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="flex gap-2 justify-end mt-4">
                      <Button variant="outline" onClick={() => setIsChangingPassword(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleChangePassword}>
                        Update Password
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm mb-4">
                      It's a good idea to use a strong password that you don't use elsewhere.
                    </p>
                    <Button onClick={() => setIsChangingPassword(true)}>
                      Change Password
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Login Activity</CardTitle>
                <CardDescription>
                  Recent logins to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleDateString()} • {navigator.userAgent.includes('Windows') ? 'Windows' : 
                          navigator.userAgent.includes('Mac') ? 'MacOS' : 
                          navigator.userAgent.includes('Linux') ? 'Linux' : 'Unknown OS'}
                      </p>
                    </div>
                    <div className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full">
                      Active Now
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
