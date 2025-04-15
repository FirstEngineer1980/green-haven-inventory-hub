
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useUsers } from '@/context/UserContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Role, User } from '@/types';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UserTable from '@/components/users/UserTable';
import AddUserDialog from '@/components/users/AddUserDialog';
import EditUserDialog from '@/components/users/EditUserDialog';
import ExportButton from '@/components/shared/ExportButton';
import ImportButton from '@/components/shared/ImportButton';
import { getTemplateUrl, validateTemplate } from '@/utils/templateGenerator';

const Users = () => {
  const { users, addUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const { toast } = useToast();
  
  const handleUserImport = (data: any[]) => {
    try {
      data.forEach(userData => {
        const user = {
          name: userData.name,
          email: userData.email,
          role: userData.role as Role,
          permissions: userData.permissions || [],
          avatar: userData.avatar
        };
        addUser(user);
      });
      
      toast({
        title: "Users imported",
        description: `${data.length} users have been imported successfully`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error importing users:', error);
      toast({
        title: "Import failed",
        description: "An error occurred while importing users",
        variant: "destructive",
      });
    }
  };

  // Filter users by search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Users</h1>
        <div className="flex gap-2">
          <ImportButton 
            onImport={handleUserImport} 
            templateUrl={getTemplateUrl('users')}
            validationFn={(data) => validateTemplate(data, 'users')}
          />
          <ExportButton 
            data={users} 
            filename="users" 
            fields={['id', 'name', 'email', 'role', 'permissions', 'avatar', 'createdAt', 'lastActive']}
          />
          <Button onClick={() => setOpenAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New User
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:w-64">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>
            Manage users and their access to the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserTable 
            users={filteredUsers}
            onEdit={(user) => {
              setSelectedUser(user);
              setOpenEditDialog(true);
            }}
          />
        </CardContent>
      </Card>

      <AddUserDialog open={openAddDialog} onOpenChange={setOpenAddDialog} />
      
      {selectedUser && (
        <EditUserDialog 
          open={openEditDialog} 
          onOpenChange={setOpenEditDialog} 
          user={selectedUser} 
        />
      )}
    </DashboardLayout>
  );
};

export default Users;
